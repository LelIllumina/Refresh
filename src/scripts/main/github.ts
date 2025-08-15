fetch("https://api.github.com/repos/LelIllumina/Refresh/commits?per_page=1")
  .then((res) => res.json())
  .then((res) => {
    const sha = res[0].sha;
    const authorDate = new Date(res[0].commit.author.date);
    (
      document.getElementById("commit-latest") as HTMLParagraphElement
    ).innerText = res[0].commit.message;
    (document.getElementById("short-hash") as HTMLParagraphElement).innerText =
      `latest commit:${sha.substring(0, 7)} on ${authorDate.toLocaleDateString(
        "en-GB",
        {
          day: "2-digit",
          month: "2-digit",
          year: "2-digit",
        },
      )}`;
    (document.getElementById("commit-link") as HTMLAnchorElement).href =
      `https://github.com/LelIllumina/NueNekos/commit/${sha}`;
  });
