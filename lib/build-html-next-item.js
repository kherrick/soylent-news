import { buildDescendants } from "./build-html-descendants.js";

export const buildNextItem = async ({
  document,
  dateTime,
  itemComments,
  itemLink,
  itemTitle,
  handleText = null,
  fetchItemDetails = true,
  // fetchItemDetails = false,
}) => {
  const itemId = itemComments.split("?sid=")[1].split('&')[0];

  const section = document.createElement("section");
  section.setAttribute("id", itemId);

  const itemAnchor = document.createElement("a");
  itemAnchor.textContent = itemTitle.replace(/\0/g, "");
  itemAnchor.setAttribute("class", "item");
  itemAnchor.setAttribute("href", itemLink);

  const header = document.createElement("h3");
  header.appendChild(itemAnchor);
  section.appendChild(header);

  const dateSpan = document.createElement("span");
  const [date, time] = dateTime.split(",");
  dateSpan.textContent = `${date.replace("24:", "00:")} @ ${time}`;

  try {
    const points = document.createElement("span");
    points.setAttribute("class", "points");
    points.textContent = "0";

    const pointsSpan = document.createElement("span");
    pointsSpan.setAttribute("class", "points-container");
    pointsSpan.textContent = "Points: ";
    pointsSpan.appendChild(points);

    const itemSection = document.createElement("section");
    const itemHeader = document.createElement("h4");
    itemHeader.appendChild(dateSpan);
    itemHeader.appendChild(pointsSpan);

    itemSection.appendChild(itemHeader);

    if (fetchItemDetails) {
      const { bodytext, commentcount, hits, sid } = await (
        await fetch(`https://soylentnews.org/api.pl?m=story&op=single&sid=${itemId}`)
      ).json();

      if (hits) {
        points.textContent = hits;
      }

      // handle comments
      const comments = buildDescendants(
        document,
        commentcount,
        `https://soylentnews.org/article.pl?sid=${sid}`
      );

      itemHeader.appendChild(comments);

      if (handleText) {
        handleText(bodytext, itemSection);
      }
    }

    section.appendChild(itemSection);
  } catch (error) {}

  return section;
};
