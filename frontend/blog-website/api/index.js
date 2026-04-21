import network from "../config/network";



// Function to get SEO data
export async function getSeoData(page) {
  const res = await fetch(`${network.baseURL}/salons/seo/${page}/`);
  const data = await res.json();
  return {
    meta_title: data.meta_title,
    meta_description: data.meta_description,
    meta_keywords: data.meta_keywords,
  };
}

// Function to get blog categories
export async function getBlogCategories() {
  const blogcategoryResponse = await fetch(
    `${network.baseURL}/salons/blogcategory/`
  );
  const blogcategoryData = await blogcategoryResponse.json();
  return {
    blogcategory: blogcategoryData.results,
  };
}

// Function to get blogs
export async function getBlogs() {
  const blogResponse = await fetch(`${network.baseURL}/salons/blogs/`);
  const blogData = await blogResponse.json();
  return {
    blogs: blogData.payload,
  };
}

// Function to get blog by slug
export async function getBlogBySlug(slug) {
  const blogResponse = await fetch(`${network.baseURL}/salons/blogs/?slug=${slug}`);
  const blogData = await blogResponse.json();
  
  const blog = blogData.payload.filter((item) => item.slug === slug);


  return {
    blog: blog[0],
  };
}

// Function to get blog by category
export async function getBlogByCategory(category , blogCategories) {
  const blogResponse = await fetch(
    `${network.baseURL}/salons/blogs/?category_slug=${category}`
  );

  const blogData = await blogResponse.json();

  let filteredCategoryID = blogCategories.filter((item) => item.slug === category)?.[0]?.id;

  let filteredBlogs = blogData.payload.filter((item) => item.categories[0] === filteredCategoryID);

  return {
    blogs: filteredBlogs,
  };
}

// Function to get blog by category and city
export async function getBlogByCategoryAndCity(category, city) {
  const blogResponse = await fetch(
    `${network.baseURL}/salons/blog/?category=${category}&city=${city}`
  );
  const blogData = await blogResponse.json();
  return {
    blogs: blogData.results,
  };
}

// Function to get cities
export async function getCities() {
  const cityResponse = await fetch(`${network.baseURL}/salons/city/`);
  const cityData = await cityResponse.json();
  return {
    cities: cityData.payload.map((item) => item.name),
  };
}

export async function getBlogsBySearch(searchKeyword) {
  const blogResponse = await fetch(
    `${network.baseURL}/salons/blogs/?search=${searchKeyword}`
  );
  const blogData = await blogResponse.json();
  return {
    blogs: blogData.payload,
  };
}
