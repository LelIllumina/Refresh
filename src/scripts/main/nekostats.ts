export interface NekostatsResponse {
  id: number;
  username: string;
  title: string;
  updates: number;
  followers: number;
  views: number;
  created_at: number;
  updated_at: number;
}

function getRequiredElement<T extends HTMLElement>(id: string): T {
  const el = document.getElementById(id);
  if (!el) throw new Error(`Element with id "${id}" not found`);
  return el as T;
}

async function fetchNekostats(domain: string): Promise<NekostatsResponse> {
  const response = await fetch(`https://nekoweb.org/api/site/info/${domain}`);

  const data = await response.json();

  return data;
}

(async () => {
  try {
    const json = await fetchNekostats("lel.nekoweb.org");

    const updated = new Date(json.updated_at).toLocaleDateString();
    const created = new Date(json.created_at).toLocaleDateString();
    const createdEl = getRequiredElement<HTMLParagraphElement>("created");
    const updatedEl = getRequiredElement<HTMLParagraphElement>("updated");
    const followersEl = getRequiredElement<HTMLParagraphElement>("followers");

    createdEl.innerHTML = `<em>Created</em>: <time datetime="${created}">${created}</time>`;
    updatedEl.innerHTML = `<em>Updated</em>: <time datetime="${updated}">${updated}</time>`;
    followersEl.innerHTML = `<em>Followers</em>: ${json.followers}`;

    const viewsContainer = getRequiredElement<HTMLDivElement>("views-counter");
    const viewsText = getRequiredElement<HTMLSpanElement>("views-text");
    viewsText.textContent = json.views.toString();

    const imgElements =
      viewsContainer.querySelectorAll<HTMLImageElement>("img");
    const digits = json.views.toString().split("");

    for (let i = 0; i < digits.length; i++) {
      if (!imgElements[i]) break;
      const digit = digits[i];

      imgElements[i].src = `/images/main/numbers/${digit}.gif`;
      imgElements[i].alt = digit;
    }
  } catch (error: unknown) {
    console.error(error);

    const viewsContainer = getRequiredElement<HTMLDivElement>("views-counter");

    const subtitle = getRequiredElement<HTMLDivElement>("subtitle");

    subtitle.innerHTML = "Script failed Noooooo";
    viewsContainer.innerHTML = "";

    let status = "Unknown";
    if (error instanceof Error) {
      if (error.message.startsWith("HTTP Error:")) {
        status = error.message.split(": ")[1];
        console.error(status);
      }
    } else {
      console.error("Unknown error", error);
    }
  }
})();
