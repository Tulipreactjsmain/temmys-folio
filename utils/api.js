import fs from "fs";
import { join } from "path";
import matter from "gray-matter";

const postsDirectory = join(process.cwd(), "_posts");

export function getPostSlugs() {
  return fs.readdirSync(postsDirectory);
}

export function getPostBySlugFile(file, fields = []) {
  const slug = file.replace(/\.md$/, "");
  const fullPath = join(postsDirectory, `${slug}.md`);
  // console.log("slug", slug);
  // console.log("fullPath", fullPath);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  // console.log("fileContents", fileContents);
  const { data, content } = matter(fileContents);

  const slugItems = {};

  // Ensure only the minimal needed data is exposed
  fields.forEach((field) => {
    if (field === "slug") {
      slugItems[field] = slug;
      console.log("sligItems", slugItems);
    }
    if (field === "content") {
      slugItems[field] = content;
    }
    // console.log("items", items);
    if (typeof data[field] !== "undefined") {
      slugItems[field] = data[field];
    }
  });

  return slugItems;
}

export function getAllPosts(fields = []) {
  const slugFiles = getPostSlugs();
  const posts = slugFiles
    .map((file) => getPostBySlugFile(file, fields))
    // sort posts by date in descending order
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1));
  return posts;
}
