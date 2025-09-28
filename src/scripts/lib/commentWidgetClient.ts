import {
  loadComments,
  postComment,
  type CommentData,
} from "./commentWidget.ts";

const root = document.getElementById("comments-root");
const currentPath = window.location.pathname;

function buildTree(comments: CommentData[]) {
  const map = new Map<string, CommentData>();
  const roots: CommentData[] = [];

  comments.forEach((c) => {
    c.replies = [];
    map.set(c.id, c);
  });

  comments.forEach((c) => {
    if (c.parentId && map.has(c.parentId)) {
      map.get(c.parentId)!.replies.push(c);
    } else {
      roots.push(c);
    }
  });

  return roots;
}

function commentHTML(c: CommentData): string {
  return `
<li data-id="${c.id}" class="c-comment">
  <h3 class="c-name">
    ${c.username}
    ${
      c.website
        ? `<a href="${c.website}" target="_blank" class="c-site">Website</a>`
        : ""
    }
  </h3>
  <span class="c-timestamp">${
    c.createdAt?.toDate?.().toLocaleString?.() ?? ""
  }</span>
  <p class="c-text">${c.content}</p>
  <button class="c-reply-button c-submit-button">Reply</button>
  <div class="reply-form" style="display:none;">
    <div class="c-input-wrapper">
      <label class="c-label">Name:</label>
      <input class="c-input reply-username" type="text" maxlength="32" required />
    </div>
    <div class="c-input-wrapper">
      <label class="c-label">Website:</label>
      <input class="c-input reply-website" type="url" pattern="https://.*" />
    </div>
    <div class="c-input-wrapper">
      <textarea class="c-input reply-text" rows="4" maxlength="500" required></textarea>
    </div>
    <button class="submit-reply c-submit-button">Send</button>
  </div>
  ${
    c.replies.length
      ? `<ul class="c-replies">${c.replies.map(commentHTML).join("")}</ul>`
      : ""
  }
</li>`;
}

function renderUI(comments: CommentData[]) {
  const tree = buildTree(comments);

  root!.innerHTML = `
<div id="c-input-div">
  <form id="c_form">
    <h2 id="c-widget-title">Leave your comments</h2>
    <div class="c-input-wrapper">
      <label class="c-label" for="username">Name:</label>
      <input class="c-input" id="username" type="text" maxlength="32" required />
    </div>
    <div class="c-input-wrapper">
      <label class="c-label" for="website">Website:</label>
      <input class="c-input" id="website" type="url" pattern="https://.*" />
    </div>
    <div class="c-input-wrapper">
      <textarea class="c-input" id="comment-text" rows="4" maxlength="500" required></textarea>
    </div>
    <button class="c-submit-button" type="submit">Send</button>
  </form>
</div>
<div id="c_container">
  ${
    tree.length
      ? `<ul id="comment-list">${tree.map(commentHTML).join("")}</ul>`
      : "<p>No comments yet!</p>"
  }
</div>`;

  bindEvents();
}

function bindEvents() {
  document.getElementById("c_form")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = (document.getElementById("username") as HTMLInputElement)
      .value;
    const website = (document.getElementById("website") as HTMLInputElement)
      .value;
    const text = (
      document.getElementById("comment-text") as HTMLTextAreaElement
    ).value;
    await postComment(username, text, currentPath, undefined, website);
    await loadAndRender();
  });

  document
    .querySelectorAll<HTMLButtonElement>(".c-reply-button")
    .forEach((btn) =>
      btn.addEventListener("click", () => {
        const form = btn.nextElementSibling as HTMLElement;
        form.style.display = form.style.display === "none" ? "block" : "none";
      }),
    );

  document.querySelectorAll<HTMLButtonElement>(".submit-reply").forEach((btn) =>
    btn.addEventListener("click", async () => {
      const li = btn.closest("li")!;
      const parentId = li.getAttribute("data-id") ?? undefined;
      const username = (li.querySelector(".reply-username") as HTMLInputElement)
        .value;
      const website = (li.querySelector(".reply-website") as HTMLInputElement)
        .value;
      const text = (li.querySelector(".reply-text") as HTMLTextAreaElement)
        .value;
      await postComment(username, text, currentPath, parentId, website);
      await loadAndRender();
    }),
  );
}

async function loadAndRender() {
  const comments = await loadComments(currentPath);
  renderUI(comments);
}

loadAndRender();
