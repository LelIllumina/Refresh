import { createClient, SupabaseClient } from "@supabase/supabase-js";

interface Comment {
  username: string;
  content: string;
  website?: string | null;
  created_at: string;
  reply_to?: string | null;
}

class SupabaseComments extends HTMLElement {
  private supabase!: SupabaseClient;
  private root!: HTMLElement;
  private commentsRoot!: HTMLElement;
  private form!: HTMLFormElement;

  connectedCallback() {
    const url = this.getAttribute("supabase-url");
    const key = this.getAttribute("supabase-key");

    if (!url || !key) {
      console.error("Missing supabase-url or supabase-key");
      return;
    }

    this.supabase = createClient(url, key);
    this.root = this /* .attachShadow({ mode: "open" }) */;

    this.render();
    this.loadComments();
  }

  private render() {
    this.root.innerHTML = /* html */ `
      <section id="comments">
        <h2 class="comment-form__title">Comments</h2>
        <form id="comment-form">
          <h3>Leave your answers in the comments below</h3>

          <label for="username">Name:</label>
          <input
            name="username"
            id="username"
            placeholder="Lel"
            required
            autocomplete="name"
            class="comment-form__field comment-form__input"
          />

          <label for="website">(Optional) Website:</label>
          <input
            name="website"
            id="website"
            placeholder="https://lel.nekoweb.org/"
            pattern="https?://.+"
            autocomplete="url"
            class="comment-form__field comment-form__input"
          />
          <label for="content">Comment:</label>
          <textarea
            name="content"
            id="content"
            placeholder="Write a comment..."
            required
            class="comment-form__field comment-form__input"></textarea>
          <br />
          <button type="submit">Post</button>
        </form>

        <div id="comments-root">
          <p>Loading comments…</p>
        </div>

        <template id="comment-template">
          <article class="comment">
            <header class="comment__header">
              <span class="comment__username"></span>
              <time class="comment__time"></time>
            </header>
            <p class="comment__content"></p>
          </article>
        </template>
      </section>
    `;

    this.commentsRoot = this.root.querySelector(
      "#comments-root",
    ) as HTMLElement;

    this.form = this.root.querySelector("#comment-form") as HTMLFormElement;
    this.form.addEventListener("submit", this.handleSubmit.bind(this));
  }

  private async loadComments() {
    const { data, error } = await this.supabase
      .from("comments")
      .select("*")
      .eq("slug", window.location.pathname)
      .order("created_at", { ascending: true });

    if (error) {
      console.error(error);
      this.commentsRoot.textContent = "Failed to load comments.";
      return;
    }

    if (!data || data.length === 0) {
      this.commentsRoot.innerHTML = "<p>No comments yet.</p>";
      return;
    }

    this.renderComments(data);
  }

  private renderComments(comments: Comment[]) {
    const template = this.root.querySelector(
      "#comment-template",
    ) as HTMLTemplateElement;

    this.commentsRoot.innerHTML = "";
    const frag = document.createDocumentFragment();

    for (const c of comments) {
      const clone = template.content.cloneNode(true) as DocumentFragment;

      const username = clone.querySelector(".comment__username") as HTMLElement;
      const content = clone.querySelector(".comment__content") as HTMLElement;
      const time = clone.querySelector(".comment__time") as HTMLTimeElement;
      const header = clone.querySelector(".comment__header") as HTMLElement;

      username.textContent = c.username;
      content.textContent = c.content;

      if (c.website) {
        const link = document.createElement("a");
        link.href = c.website;
        link.textContent = "website↗";
        link.target = "_blank";
        link.rel = "nofollow noopener";
        link.className = "comment__website";
        header.appendChild(link);
      }

      const date = new Date(c.created_at);
      time.textContent = date.toLocaleString();
      time.dateTime = date.toISOString();

      frag.appendChild(clone);
    }

    this.commentsRoot.appendChild(frag);
  }

  private async handleSubmit(e: Event) {
    e.preventDefault();

    const data = new FormData(this.form);
    const username = String(data.get("username")).trim();
    const content = String(data.get("content")).trim();
    const website = String(data.get("website") || "").trim();

    if (!username || !content) return;

    const button = this.form.querySelector("button")!;
    button.disabled = true;

    try {
      const { error } = await this.supabase.from("comments").insert({
        slug: window.location.pathname,
        username,
        content,
        website: website || null,
        reply_to: null,
      });

      if (error) throw error;

      this.form.reset();
      await this.loadComments();
    } catch (err) {
      console.error(err);
      alert("Failed to post comment. Please try again.");
    } finally {
      button.disabled = false;
    }
  }
}

customElements.define("supabase-comments", SupabaseComments);
