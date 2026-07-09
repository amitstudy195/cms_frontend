// API Service for CMS Admin Panel
// Supports both simulated LocalStorage Mock operations and real Backend API endpoints.

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== "false"; // Default to true, set to "false" to connect backend
const BASE_URL = import.meta.env.VITE_API_URL || "https://localhost:5000/api";
const DELAY = 600;

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const SEED_PAGES = [
  {
    id: "pg-1",
    title: "About Our Company",
    slug: "about-us",
    type: "page",
    content: "We are a forward-thinking technology team focused on delivering beautiful software solutions. Our mission is to make developer tools accessible and delightful for everyone. We believe in crafting premium user experiences that combine utility with speed.",
    status: "Published",
    lastModified: "2026-07-01T10:30:00Z",
    author: "Jane Doe (Admin)",
    seoTitle: "About Us | TechCorp Solutions",
    seoDescription: "Learn more about TechCorp's mission, values, and the team building the future of developer tools.",
    featuredImage: "https://images.unsplash.com/photo-1542744094-3a31f103e35f?w=600&auto=format&fit=crop&q=60"
  },
  {
    id: "pg-2",
    title: "Developer Documentation",
    slug: "docs",
    type: "page",
    content: "Welcome to our documentation. Here you will find quick start guides, API references, and detailed tutorials. To integrate our REST SDK, install the package and configure your workspace client keys.",
    status: "Draft",
    lastModified: "2026-07-02T15:45:00Z",
    author: "Alex Rivera (Editor)",
    seoTitle: "Developer SDK Reference & Guides",
    seoDescription: "Comprehensive API references and integration workflows for the TechCorp REST SDK.",
    featuredImage: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=600&auto=format&fit=crop&q=60"
  },
  {
    id: "pg-3",
    title: "Summer Product Launch",
    slug: "summer-launch",
    type: "page",
    content: "We are thrilled to announce our Summer 2026 feature list, including real-time sync, visual analytics dashboards, and custom webhook configurations.",
    status: "Scheduled",
    scheduledDate: "2026-08-15T09:00:00Z",
    lastModified: "2026-07-03T09:00:00Z",
    author: "Jane Doe (Admin)",
    seoTitle: "Summer 2026 Launch Event",
    seoDescription: "Register for the summer launch and be the first to try real-time visual syncing.",
    featuredImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=60"
  },
  {
    id: "pg-4",
    title: "Enterprise Solutions Guide",
    slug: "enterprise-guide",
    type: "page",
    content: "Explore custom SLAs, dedicated database clusters, high-availability deployments, and dedicated account support features tailored for global engineering groups.",
    status: "Published",
    lastModified: "2026-07-03T10:12:00Z",
    author: "Jane Doe (Admin)",
    seoTitle: "TechCorp Enterprise Offerings",
    seoDescription: "Custom solutions, high-availability setups, SLAs, and dedicated technical resources.",
    featuredImage: "https://images.unsplash.com/photo-1542744094-3a31f103e35f?w=600&auto=format&fit=crop&q=60"
  },
  {
    id: "pg-5",
    title: "Security & Compliance Specs",
    slug: "security-compliance",
    type: "page",
    content: "Our systems conform to SOC2 Type II, ISO-27001, and HIPAA compliance policies. We perform daily automated vulnerability scanning and security audits.",
    status: "Draft",
    lastModified: "2026-07-03T11:45:00Z",
    author: "Alex Rivera (Editor)",
    seoTitle: "Security Policies & Compliance Standards",
    seoDescription: "Compliance matrix including SOC2, ISO-27001, and data privacy procedures.",
    featuredImage: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=600&auto=format&fit=crop&q=60"
  },
  {
    id: "pg-6",
    title: "Customer Case Studies",
    slug: "case-studies",
    type: "page",
    content: "See how startups and Fortune 500 corporations increase performance metrics and reduce API latency overheads using our visual CMS integrations.",
    status: "Published",
    lastModified: "2026-07-03T12:05:00Z",
    author: "Jane Doe (Admin)",
    seoTitle: "CMS Case Studies & Client Stories",
    seoDescription: "Discover integration stories from our global client base.",
    featuredImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=60"
  }
];

const SEED_BANNERS = [
  {
    id: "bn-1",
    title: "Hero Promotion 20%",
    slug: "hero-promo-summer",
    type: "banner",
    content: "Save 20% off all developer tier plans this summer with coupon SUMMER20.",
    status: "Published",
    lastModified: "2026-06-28T12:00:00Z",
    author: "Jane Doe (Admin)",
    seoTitle: "",
    seoDescription: "",
    featuredImage: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600&auto=format&fit=crop&q=60"
  }
];

const SEED_MEDIA = [
  {
    id: "med-1",
    name: "analytics-chart.jpg",
    url: "https://images.unsplash.com/photo-1542744094-3a31f103e35f?w=600&auto=format&fit=crop&q=60",
    type: "image/jpeg",
    size: "412 KB",
    uploadedAt: "2026-06-25T08:12:00Z"
  },
  {
    id: "med-2",
    name: "hero-coding.jpg",
    url: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=600&auto=format&fit=crop&q=60",
    type: "image/jpeg",
    size: "625 KB",
    uploadedAt: "2026-06-26T14:23:00Z"
  },
  {
    id: "med-3",
    name: "financial-report.jpg",
    url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=60",
    type: "image/jpeg",
    size: "248 KB",
    uploadedAt: "2026-06-27T11:45:00Z"
  },
  {
    id: "med-4",
    name: "developer-workspace.jpg",
    url: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600&auto=format&fit=crop&q=60",
    type: "image/jpeg",
    size: "812 KB",
    uploadedAt: "2026-06-28T09:10:00Z"
  }
];

// Initialise Database for Mocking
const initDB = () => {
  if (!localStorage.getItem("cms_content")) {
    localStorage.setItem("cms_content", JSON.stringify([...SEED_PAGES, ...SEED_BANNERS]));
  }
  if (!localStorage.getItem("cms_media")) {
    localStorage.setItem("cms_media", JSON.stringify(SEED_MEDIA));
  }
};

initDB();

const getRawContent = () => JSON.parse(localStorage.getItem("cms_content") || "[]");
const setRawContent = (data) => localStorage.setItem("cms_content", JSON.stringify(data));
const getRawMedia = () => JSON.parse(localStorage.getItem("cms_media") || "[]");
const setRawMedia = (data) => localStorage.setItem("cms_media", JSON.stringify(data));

// Header generator for authentication on real API requests
const getHeaders = (isMultipart = false) => {
  const token = localStorage.getItem("cms_jwt_token");
  return {
    ...(isMultipart ? {} : { "Content-Type": "application/json" }),
    ...(token ? { "Authorization": `Bearer ${token}` } : {})
  };
};

// -------------------------------------------------------------
// Provider A: Client-side LocalStorage Mock API
// -------------------------------------------------------------
const mockApi = {
  async getContent(type, page = 1, limit = 5, search = "", statusFilter = "All") {
    await delay(DELAY);
    let allContent = getRawContent();
    
    if (type) {
      allContent = allContent.filter(item => item.type === type);
    }
    if (statusFilter !== "All") {
      allContent = allContent.filter(item => item.status === statusFilter);
    }
    if (search) {
      const q = search.toLowerCase();
      allContent = allContent.filter(
        item => item.title.toLowerCase().includes(q) || item.slug.toLowerCase().includes(q)
      );
    }

    allContent.sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified));

    const totalCount = allContent.length;
    const totalPages = Math.ceil(totalCount / limit);
    const startIndex = (page - 1) * limit;
    const paginatedItems = allContent.slice(startIndex, startIndex + limit);

    return {
      success: true,
      data: paginatedItems,
      pagination: { page, limit, totalCount, totalPages }
    };
  },

  async getContentById(id) {
    await delay(DELAY - 200);
    const allContent = getRawContent();
    const item = allContent.find(item => item.id === id);
    if (!item) throw new Error("Content item not found");
    return item;
  },

  async createContent(itemData) {
    await delay(DELAY);
    const allContent = getRawContent();
    if (allContent.some(item => item.slug === itemData.slug && item.type === itemData.type)) {
      throw new Error(`A ${itemData.type} with the slug "${itemData.slug}" already exists.`);
    }
    const newItem = {
      ...itemData,
      id: `${itemData.type === 'page' ? 'pg' : 'bn'}-${Date.now()}`,
      lastModified: new Date().toISOString(),
      status: itemData.status || "Draft"
    };
    allContent.push(newItem);
    setRawContent(allContent);
    return newItem;
  },

  async updateContent(id, itemData) {
    await delay(DELAY);
    const allContent = getRawContent();
    const index = allContent.findIndex(item => item.id === id);
    if (index === -1) throw new Error("Content item to update not found");

    if (itemData.slug && allContent.some(item => item.id !== id && item.slug === itemData.slug && item.type === allContent[index].type)) {
      throw new Error(`A ${allContent[index].type} with the slug "${itemData.slug}" already exists.`);
    }

    const updatedItem = {
      ...allContent[index],
      ...itemData,
      id,
      lastModified: new Date().toISOString()
    };
    allContent[index] = updatedItem;
    setRawContent(allContent);
    return updatedItem;
  },

  async deleteContent(id) {
    await delay(DELAY);
    const allContent = getRawContent();
    const filteredContent = allContent.filter(item => item.id !== id);
    if (allContent.length === filteredContent.length) {
      throw new Error("Content item to delete not found");
    }
    setRawContent(filteredContent);
    return { success: true, deletedId: id };
  },

  async getMedia() {
    await delay(DELAY - 100);
    return getRawMedia();
  },

  async uploadMedia(fileObj) {
    await delay(DELAY + 300);
    const allMedia = getRawMedia();
    let url = "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=600";
    
    // Generate object URL for preview if File or Blob-like object
    const isBlobLike = fileObj && (
      fileObj instanceof Blob ||
      fileObj instanceof File ||
      (fileObj.constructor && (fileObj.constructor.name === "File" || fileObj.constructor.name === "Blob")) ||
      (typeof fileObj.slice === "function" && fileObj.size !== undefined)
    );

    if (isBlobLike && fileObj.type && fileObj.type.startsWith("image/")) {
      try {
        url = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target.result);
          reader.onerror = () => reject(new Error("File reading error"));
          reader.readAsDataURL(fileObj);
        });
      } catch (err) {
        console.warn("FileReader error, falling back to placeholder", err);
      }
    } else if (fileObj && fileObj.url) {
      url = fileObj.url;
    }

    const newMedia = {
      id: `med-${Date.now()}`,
      name: fileObj.name || "uploaded_asset.jpg",
      url,
      type: fileObj.type || "image/jpeg",
      size: fileObj.size ? `${(fileObj.size / 1024).toFixed(0)} KB` : "120 KB",
      uploadedAt: new Date().toISOString()
    };
    allMedia.unshift(newMedia);
    setRawMedia(allMedia);
    return newMedia;
  },

  async deleteMedia(id) {
    await delay(DELAY);
    const allMedia = getRawMedia();
    const filteredMedia = allMedia.filter(item => item.id !== id);
    if (allMedia.length === filteredMedia.length) {
      throw new Error("Media asset to delete not found");
    }
    setRawMedia(filteredMedia);
    return { success: true, deletedId: id };
  }
};

// -------------------------------------------------------------
// Provider B: Real Backend Express REST API Connection
// -------------------------------------------------------------
const realApi = {
  async getContent(type, page = 1, limit = 5, search = "", statusFilter = "All") {
    const statusParam = statusFilter !== "All" ? `&status=${statusFilter}` : "";
    const typeParam = type ? `&type=${type}` : "";
    const searchParam = search ? `&search=${encodeURIComponent(search)}` : "";
    
    const response = await fetch(
      `${BASE_URL}/pages?page=${page}&limit=${limit}${typeParam}${statusParam}${searchParam}`,
      { headers: getHeaders() }
    );
    const data = await response.json();
    if (!data.success) throw new Error(data.message);
    
    // Map backend Page shape (author contains full object) to UI representation
    const mappedData = data.data.map(item => ({
      id: item._id,
      title: item.title,
      slug: item.slug,
      type: item.type,
      content: item.content,
      status: item.status,
      lastModified: item.updatedAt || item.createdAt,
      author: item.author ? item.author.name : "System",
      featuredImage: item.featuredImage,
      seoTitle: item.seo?.metaTitle || "",
      seoDescription: item.seo?.metaDescription || ""
    }));

    return {
      success: true,
      data: mappedData,
      pagination: data.pagination
    };
  },

  async getContentById(id) {
    const response = await fetch(`${BASE_URL}/pages/${id}`, {
      headers: getHeaders()
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.message);
    
    const item = data.data;
    return {
      id: item._id,
      title: item.title,
      slug: item.slug,
      type: item.type,
      content: item.content,
      status: item.status,
      lastModified: item.updatedAt || item.createdAt,
      author: item.author ? item.author.name : "System",
      featuredImage: item.featuredImage,
      seoTitle: item.seo?.metaTitle || "",
      seoDescription: item.seo?.metaDescription || ""
    };
  },

  async createContent(itemData) {
    const response = await fetch(`${BASE_URL}/pages`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(itemData)
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.message);
    return data.data;
  },

  async updateContent(id, itemData) {
    const response = await fetch(`${BASE_URL}/pages/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(itemData)
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.message);
    return data.data;
  },

  async deleteContent(id) {
    const response = await fetch(`${BASE_URL}/pages/${id}`, {
      method: "DELETE",
      headers: getHeaders()
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.message);
    return data;
  },

  async getMedia() {
    const response = await fetch(`${BASE_URL}/media`, {
      headers: getHeaders()
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.message);
    
    return data.data.map(item => ({
      id: item._id,
      name: item.originalName,
      // Prefix with server host if local file path
      url: item.url.startsWith("http") ? item.url : `http://localhost:5000${item.url}`,
      type: item.fileType,
      size: item.fileSize,
      uploadedAt: item.createdAt
    }));
  },

  async uploadMedia(fileObj) {
    const formData = new FormData();
    formData.append("file", fileObj); // matches 'file' multer key

    const response = await fetch(`${BASE_URL}/media/upload`, {
      method: "POST",
      headers: getHeaders(true), // skip Content-Type for boundary configuration
      body: formData
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.message);
    
    return {
      id: data.data._id,
      name: data.data.originalName,
      url: data.data.url.startsWith("http") ? data.data.url : `http://localhost:5000${data.data.url}`,
      type: data.data.fileType,
      size: data.data.fileSize,
      uploadedAt: data.data.createdAt
    };
  },

  async deleteMedia(id) {
    const response = await fetch(`${BASE_URL}/media/${id}`, {
      method: "DELETE",
      headers: getHeaders()
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.message);
    return data;
  }
};

// Export configuration
console.log(`CMS Connection Provider Mode: ${USE_MOCK ? "LOCAL MOCK" : "EXTERNAL EXPRESS BACKEND"}`);
export const api = USE_MOCK ? mockApi : realApi;
