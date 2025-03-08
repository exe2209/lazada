// Global variables
let selectedTheme = "Lazada";
let domains = [];
let redirects = [];
let currentUser = null;

// Set headers with Bearer Token
function getAuthHeaders() {
  const token = sessionStorage.getItem("authToken"); // Ambil token dari sessionStorage
  if (token) {
    return {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    };
  } else {
    console.error("No token found in sessionStorage");
    return {
      "Content-Type": "application/json",
    };
  }
}

// Example of making an API request with authorization token
function getDomains() {
  const url = "https://api.cloudflare.com/client/v4/zones"; // Adjust the URL as needed

  fetch(url, {
    method: "GET",
    headers: getAuthHeaders(),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Domains:", data);
    })
    .catch((error) => {
      console.error("Error fetching domains:", error);
    });
}

// Mock user data (in a real app, this would be in a database)
const users = [
  {
    email: "admin@example.com",
    password: "admin123",
    name: "Administrator",
    role: "admin",
  },
  {
    email: "user@example.com",
    password: "user123",
    name: "Regular User",
    role: "user",
  },
];

// Login handling
function login(event) {
  event.preventDefault();

  const email = document.getElementById("email-address").value;
  const password = document.getElementById("password").value;
  const errorElement = document.getElementById("login-error");

  // Find user
  const user = users.find((u) => u.email === email && u.password === password);

  if (user) {
    // Successful login
    sessionStorage.setItem("currentUser", JSON.stringify(user));

    // Simulate token retrieval and store it in sessionStorage
    // In a real app, you should retrieve the token from your authentication API
    const token = "KHVHEDi9rCidwqV-sYyq-EgNow3ZfCpCD1vaGz_r"; // Replace with actual token retrieval logic
    sessionStorage.setItem("authToken", token);

    // Update UI with user info
    showAdminPanel(user);

    // Hide any previous error
    errorElement.classList.add("hidden");
  } else {
    // Failed login
    errorElement.classList.remove("hidden");
  }
}

// Function to show admin panel and hide login screen
function showAdminPanel(user) {
  // Update UI with user info
  document.getElementById("user-initial").textContent = user.name.charAt(0);
  document.getElementById("username-display").textContent = user.name;

  // Hide login screen, show admin panel
  document.getElementById("login-screen").classList.add("hidden");
  document.getElementById("admin-panel").classList.remove("hidden");
}

// Logout handling
function logout() {
  // Clear current user and token from sessionStorage
  sessionStorage.removeItem("currentUser");
  sessionStorage.removeItem("authToken");

  // Hide admin panel, show login screen
  document.getElementById("login-screen").classList.remove("hidden");
  document.getElementById("admin-panel").classList.add("hidden");

  // Clear form
  document.getElementById("email-address").value = "";
  document.getElementById("password").value = "";
  document.getElementById("login-error").classList.add("hidden");

  // Hide user dropdown if open
  document.getElementById("user-dropdown").classList.add("hidden");
}

// Call the checkLoginStatus function when the page loads
window.onload = function () {
  checkLoginStatus();

  // Set theme tab as active by default
  setActiveTab("themes");

  // Inisialisasi form jika tema sudah dipilih
  if (selectedTheme) {
    handleThemeChange(selectedTheme);
    initializeKeywordField();
  }
};

// Check Login Status
function checkLoginStatus() {
  const storedUser = sessionStorage.getItem("currentUser");

  if (storedUser) {
    const user = JSON.parse(storedUser);
    showAdminPanel(user);
  }
}

// Tambahkan fungsi untuk mengisi nilai input keyword dari meta tag saat halaman dimuat
function initializeKeywordField() {
  if (selectedTheme) {
    const keywordInput = document.getElementById(
      `${selectedTheme.toLowerCase()}-keyword`
    );
    if (keywordInput) {
      const metaKeywords = document.querySelector('meta[name="keywords"]');
      if (metaKeywords) {
        keywordInput.value = metaKeywords.getAttribute("content");
      }
    }
  }
}

// Login Session END

// Toggle user dropdown menu
function toggleUserMenu() {
  const dropdown = document.getElementById("user-dropdown");
  dropdown.classList.toggle("hidden");
}

// Tab handling
function setActiveTab(tabName) {
  document.querySelectorAll(".tab-content").forEach((tab) => {
    tab.classList.add("hidden");
  });

  document.querySelectorAll("nav button").forEach((button) => {
    button.classList.remove("border-blue-500", "text-blue-600");
    button.classList.add(
      "border-transparent",
      "text-gray-500",
      "hover:text-gray-700",
      "hover:border-gray-300"
    );
  });

  const activeTab = document.getElementById(`${tabName}-content`);
  const activeButton = document.getElementById(`${tabName}-tab`);
  if (activeTab && activeButton) {
    activeTab.classList.remove("hidden");
    activeButton.classList.add("border-blue-500", "text-blue-600");
  }

  // Special handling for redirect tab to reload data
  if (tabName === "redirect") {
    fetchDomains();
  }
}

// Theme handling
function handleThemeChange(theme) {
  try {
    console.log("handleThemeChange started for theme:", theme);
    selectedTheme = theme;

    // Check if elements exist before manipulating them
    const lazadaTheme = document.getElementById("lazada-theme");
    const shopeeTheme = document.getElementById("shopee-theme");
    const squareTheme = document.getElementById("square-theme");

    if (!lazadaTheme || !shopeeTheme || !squareTheme) {
      console.error("One or more theme elements not found in DOM");
      return;
    }

    // Reset all themes
    lazadaTheme.classList.remove("border-blue-500", "bg-blue-50");
    shopeeTheme.classList.remove("border-blue-500", "bg-blue-50");
    squareTheme.classList.remove("border-blue-500", "bg-blue-50");

    lazadaTheme.classList.add("border-gray-200");
    shopeeTheme.classList.add("border-gray-200");
    squareTheme.classList.add("border-gray-200");

    // Highlight selected theme
    const selectedThemeEl = document.getElementById(
      `${theme.toLowerCase()}-theme`
    );
    if (selectedThemeEl) {
      selectedThemeEl.classList.remove("border-gray-200");
      selectedThemeEl.classList.add("border-blue-500", "bg-blue-50");
    } else {
      console.error(
        `Selected theme element ${theme.toLowerCase()}-theme not found`
      );
    }

    // Tampilkan container form tema
    const formContainer = document.getElementById("theme-form-container");
    const themeNameEl = document.getElementById("selected-theme-name");

    if (formContainer) {
      formContainer.classList.remove("hidden");
      console.log("Form container should now be visible");
    } else {
      console.error("Form container element not found");
    }

    if (themeNameEl) {
      themeNameEl.textContent = theme;
    } else {
      console.error("Selected theme name element not found");
    }

    // Isi form berdasarkan tema yang dipilih
    generateThemeForm(theme);

    // Perbarui dropdown domain
    populateDomainDropdowns();

    console.log("handleThemeChange completed successfully");
  } catch (error) {
    console.error("Error in handleThemeChange:", error);
    alert("Terjadi kesalahan saat mengubah tema. Silahkan coba lagi.");
  }
}

// Fungsi untuk menghasilkan form berdasarkan tema
function generateThemeForm(theme) {
  const formContainer = document.getElementById("dynamic-theme-form");
  let themeColor, hoverColor, formHtml;

  // Set warna berdasarkan tema
  switch (theme.toLowerCase()) {
    case "lazada":
      themeColor = "orange-500";
      hoverColor = "orange-600";
      break;
    case "shopee":
      themeColor = "orange-600";
      hoverColor = "orange-700";
      break;
    case "square":
      themeColor = "blue-500";
      hoverColor = "blue-600";
      break;
    default:
      themeColor = "blue-500";
      hoverColor = "blue-600";
  }

  // Buat HTML untuk form
  formHtml = `
    <div class="bg-${
      themeColor.split("-")[0]
    }-50 border-l-4 border-${themeColor} p-4 mb-4">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-${themeColor}" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
          </svg>
        </div>
        <div class="ml-3">
          <p class="text-sm text-${themeColor}">Configuring ${theme} Theme</p>
        </div>
      </div>
    </div>

    <form class="space-y-4" id="${theme.toLowerCase()}-form" onsubmit="submitThemeForm(event, '${theme}')">
      <div class="mb-4">
        <label for="${theme.toLowerCase()}-domain-select" class="block text-sm font-medium text-gray-700">To List Domain</label>
        <select class="form-select w-full p-2 border border-gray-300 rounded" aria-label="Domain Selection" name="domains" id="${theme.toLowerCase()}-domain-select" multiple required>
          <option disabled>Select Domains</option>
        </select>
        <p class="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple domains</p>
      </div>

      <div>
        <label for="${theme.toLowerCase()}-logo" class="block text-sm font-medium text-gray-700">Logo</label>
        <input type="url" id="${theme.toLowerCase()}-logo" name="logo" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-${themeColor} focus:border-${themeColor}" placeholder="Enter logo URL" />
      </div>

      <div>
        <label for="${theme.toLowerCase()}-art" class="block text-sm font-medium text-gray-700">Link Art (Image)</label>
        <input type="url" id="${theme.toLowerCase()}-art" name="image" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-${themeColor} focus:border-${themeColor}" placeholder="Enter art image URL" />
      </div>

      <div>
        <label for="${theme.toLowerCase()}-title" class="block text-sm font-medium text-gray-700">Title</label>
        <input type="text" id="${theme.toLowerCase()}-title" name="title" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-${themeColor} focus:border-${themeColor}" required />
      </div>

      <div>
        <label for="${theme.toLowerCase()}-description" class="block text-sm font-medium text-gray-700">Description</label>
        <textarea id="${theme.toLowerCase()}-description" name="description" rows="3" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-${themeColor} focus:border-${themeColor}" required></textarea>
      </div>

      <div>
        <label for="${theme.toLowerCase()}-article" class="block text-sm font-medium text-gray-700">Article</label>
        <textarea id="${theme.toLowerCase()}-article" name="article_content" rows="3" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-${themeColor} focus:border-${themeColor}"></textarea>
      </div>

      <div>
        <label for="${theme.toLowerCase()}-amp" class="block text-sm font-medium text-gray-700">Link AMP</label>
        <input type="url" id="${theme.toLowerCase()}-amp" name="link_amp" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-${themeColor} focus:border-${themeColor}" />
      </div>

      <div>
        <label for="${theme.toLowerCase()}-button" class="block text-sm font-medium text-gray-700">Link Button</label>
        <input type="url" id="${theme.toLowerCase()}-button" name="link_button" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-${themeColor} focus:border-${themeColor}" />
      </div>

      <div>
        <label for="${theme.toLowerCase()}-canonical" class="block text-sm font-medium text-gray-700">Canonical</label>
        <input type="url" id="${theme.toLowerCase()}-canonical" name="canonical" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-${themeColor} focus:border-${themeColor}" />
      </div>

      <div>
        <label for="${theme.toLowerCase()}-favicon" class="block text-sm font-medium text-gray-700">Link Favicon</label>
        <input type="url" id="${theme.toLowerCase()}-favicon" name="link_favicon" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-${themeColor} focus:border-${themeColor}" />
      </div>

      <div>
        <label for="${theme.toLowerCase()}-keyword" class="block text-sm font-medium text-gray-700">Keyword</label>
        <input type="text" id="${theme.toLowerCase()}-keyword" name="keyword" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-${themeColor} focus:border-${themeColor}" oninput="updateMetaKeywords()" />
      </div>

      <div>
        <label for="${theme.toLowerCase()}-brand" class="block text-sm font-medium text-gray-700">Brand</label>
        <input type="text" id="${theme.toLowerCase()}-brand" name="brand" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-${themeColor} focus:border-${themeColor}" />
      </div>

      <div>
        <button type="submit" class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-${themeColor} hover:bg-${hoverColor} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${themeColor}">
          Submit
        </button>
      </div>
    </form>
  `;

  // Masukkan HTML ke dalam container
  formContainer.innerHTML = formHtml;
}

// Tambahkan fungsi ini ke dalam file script.js
function updateMetaKeywords() {
  // Ambil tema yang sedang aktif
  const theme = selectedTheme;
  console.log(`Updating meta tags for theme: ${theme}`);

  // Ambil nilai dari input keyword berdasarkan tema yang aktif
  const keywordInput = document.getElementById(
    `${theme.toLowerCase()}-keyword`
  );
  if (!keywordInput) {
    console.warn(`Keyword input for ${theme} not found`);
    return;
  }

  const keywordValue = keywordInput.value;

  // Cari meta tag keywords
  let metaKeywords = document.querySelector('meta[name="keywords"]');

  // Jika meta tag ditemukan, perbarui kontennya
  if (metaKeywords) {
    metaKeywords.setAttribute("content", keywordValue);
    console.log("Meta keywords updated to:", keywordValue);
  } else {
    console.log("Meta keywords tag not found, creating it");
    // Jika tidak ada, buat meta tag baru
    const head = document.querySelector("head");
    if (head) {
      const newMetaTag = document.createElement("meta");
      newMetaTag.setAttribute("name", "keywords");
      newMetaTag.setAttribute("content", keywordValue);
      head.appendChild(newMetaTag);
      console.log("Created new meta keywords tag");
    }
  }

  // Update meta title jika ada
  const titleInput = document.getElementById(`${theme.toLowerCase()}-title`);
  if (titleInput && titleInput.value) {
    console.log(`Updating title to: ${titleInput.value}`);

    // Update title tag
    document.title = titleInput.value;

    // Update meta og:title
    const ogTitle = document.querySelector('meta[name="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute("content", titleInput.value);
      console.log("Updated og:title");
    }

    // Update H1 tags jika ada (preview)
    const h1Tags = document.querySelectorAll("h1");
    if (h1Tags.length > 0) {
      h1Tags.forEach((h1) => {
        h1.textContent = titleInput.value;
      });
      console.log(`Updated ${h1Tags.length} h1 tags for preview`);
    }
  }

  // Update meta description jika ada
  const descInput = document.getElementById(
    `${theme.toLowerCase()}-description`
  );
  if (descInput && descInput.value) {
    console.log(`Updating description to: ${descInput.value}`);

    // Update meta description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", descInput.value);
      console.log("Updated description meta tag");
    }

    // Update meta og:description
    const ogDesc = document.querySelector('meta[name="og:description"]');
    if (ogDesc) {
      ogDesc.setAttribute("content", descInput.value);
      console.log("Updated og:description meta tag");
    }
  }

  // Update canonical jika ada
  const canonicalInput = document.getElementById(
    `${theme.toLowerCase()}-canonical`
  );
  if (canonicalInput && canonicalInput.value) {
    console.log(`Updating canonical URL to: ${canonicalInput.value}`);

    // Update link canonical
    const canonicalLink = document.querySelector('link[rel="canonical"]');
    if (canonicalLink) {
      canonicalLink.setAttribute("href", canonicalInput.value);
      console.log("Updated canonical link");
    }

    // Update meta og:url
    const ogUrl = document.querySelector('meta[name="og:url"]');
    if (ogUrl) {
      ogUrl.setAttribute("content", canonicalInput.value);
      console.log("Updated og:url meta tag");
    }

    // Update href pada elemen navigasi jika ada (preview)
    const navLinks = document.querySelectorAll("a.lzd-menu-labels-item");
    if (navLinks.length > 0) {
      navLinks.forEach((link) => {
        link.setAttribute("href", canonicalInput.value);
      });
      console.log(`Updated ${navLinks.length} navigation links for preview`);
    }
  }

  // Update logo jika ada
  const logoInput = document.getElementById(`${theme.toLowerCase()}-logo`);
  if (logoInput && logoInput.value) {
    console.log(`Updating logo URL to: ${logoInput.value}`);

    // Update logo image src
    const logoImg = document.querySelector(".lzd-logo-content img");
    if (logoImg) {
      logoImg.setAttribute("src", logoInput.value);
      logoImg.setAttribute("alt", `Logo ${titleInput?.value || theme}`);
      console.log("Updated logo image");
    }
  }

  // Update art image jika ada
  const artInput = document.getElementById(`${theme.toLowerCase()}-art`);
  if (artInput && artInput.value) {
    console.log(`Updating art image URL to: ${artInput.value}`);

    // Update art image src
    const artImg = document.querySelector(".gallery-preview-panel__image");
    if (artImg) {
      artImg.setAttribute("src", artInput.value);
      console.log("Updated art image");
    }

    // Update og:image jika ada
    const ogImage = document.querySelector('meta[name="og:image"]');
    if (ogImage) {
      ogImage.setAttribute("content", artInput.value);
      console.log("Updated og:image meta tag");
    }
  }

  // Update brand jika ada
  const brandInput = document.getElementById(`${theme.toLowerCase()}-brand`);
  if (brandInput && brandInput.value) {
    console.log(`Updating brand to: ${brandInput.value}`);

    // Update brand text dalam preview
    const brandLinks = document.querySelectorAll("a.cyan");
    if (brandLinks.length > 0) {
      brandLinks.forEach((link) => {
        link.textContent = brandInput.value;
      });
      console.log(`Updated ${brandLinks.length} brand links for preview`);
    }
  }

  console.log("Meta tags update completed");
}

// Fungsi untuk mengisi dropdown domain
async function populateDomainDropdowns() {
  try {
    // Mengambil data domain dari API
    const response = await fetch("get_zones.php?action=get_zones");

    if (!response.ok) {
      throw new Error("Failed to fetch domains");
    }

    const domains = await response.json();

    // Mendapatkan dropdown domain yang aktif
    const activeDropdown = document.querySelector("#dynamic-theme-form select");

    if (!activeDropdown) return;

    // Kosongkan dropdown terlebih dahulu (tetapi pertahankan opsi default)
    const defaultOption = activeDropdown.querySelector("option[disabled]");
    activeDropdown.innerHTML = "";

    if (defaultOption) {
      activeDropdown.appendChild(defaultOption);
    }

    // Tambahkan domain-domain dari API
    domains.forEach((domain) => {
      if (domain.name && domain.status === "active") {
        const option = document.createElement("option");
        option.value = domain.name;
        option.textContent = domain.name;
        activeDropdown.appendChild(option);
      }
    });

    console.log("Domain dropdown populated successfully");
  } catch (error) {
    console.error("Error populating domain dropdowns:", error);
  }
}

// Form submission handler
function submitThemeForm(event, theme) {
  event.preventDefault();
  console.log(`Submitting form for theme: ${theme}`);

  const form = document.getElementById(`${theme.toLowerCase()}-form`);
  const formData = new FormData(form);

  // Log form data
  console.log("Form data:");
  formData.forEach((value, key) => {
    console.log(`${key}: ${value}`);
  });

  // Get selected domains
  const domainSelect = document.getElementById(
    `${theme.toLowerCase()}-domain-select`
  );
  const selectedDomains = Array.from(domainSelect.selectedOptions).map(
    (option) => option.value
  );

  console.log(`Selected domains: ${selectedDomains.join(", ")}`);

  if (selectedDomains.length === 0) {
    console.warn("No domains selected!");
    alert("Please select at least one domain!");
    return;
  }

  // Tampilkan loading state
  const submitButton = form.querySelector('button[type="submit"]');
  const originalButtonText = submitButton.innerHTML;
  submitButton.disabled = true;
  submitButton.innerHTML = `
    <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    Processing...
  `;
  console.log("Disabled submit button and showed loading state");

  // Buat objek dari form data
  const formDataObj = {};
  formData.forEach((value, key) => {
    formDataObj[key] = value;
  });
  formDataObj.theme = theme;
  formDataObj.domains = selectedDomains;

  console.log("Prepared request payload:", formDataObj);

  // Save meta keywords first to ensure they're updated
  const keywordInput = document.getElementById(
    `${theme.toLowerCase()}-keyword`
  );
  if (keywordInput && keywordInput.value) {
    console.log(`Attempting to save meta keywords: ${keywordInput.value}`);

    // Call saveMetaKeywords and wait for it to complete before continuing
    saveMetaKeywordsAsync(keywordInput.value, theme)
      .then((result) => {
        console.log("Meta keywords saved successfully:", result);
        proceedWithThemeSave();
      })
      .catch((error) => {
        console.error("Error saving meta keywords:", error);
        // Continue anyway to save the rest of the theme
        proceedWithThemeSave();
      });
  } else {
    console.log("No keywords to save, proceeding with theme save");
    proceedWithThemeSave();
  }

  // Function to save meta keywords asynchronously
  function saveMetaKeywordsAsync(keyword, theme) {
    console.log(`Saving keywords: "${keyword}" for theme "${theme}"`);
    return new Promise((resolve, reject) => {
      fetch("save_meta_keywords.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          keyword: keyword,
          theme: theme,
        }),
      })
        .then((response) => {
          console.log("Meta keywords response status:", response.status);
          return response.json();
        })
        .then((data) => {
          console.log("Meta keywords response data:", data);
          if (data.success) {
            resolve(data);
          } else {
            reject(new Error(data.error || "Unknown error saving keywords"));
          }
        })
        .catch((error) => {
          console.error("Error in meta keywords request:", error);
          reject(error);
        });
    });
  }

  // Function to proceed with theme save after keywords are handled
  function proceedWithThemeSave() {
    // Update meta tag secara langsung di browser (untuk UX)
    try {
      updateMetaKeywords();
      console.log("Successfully updated meta keywords in browser");
    } catch (error) {
      console.error("Error updating meta keywords in browser:", error);
    }

    console.log("Sending request to save_theme.php");
    // Kirim data ke server
    fetch("save_theme.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formDataObj),
    })
      .then((response) => {
        console.log("Response status:", response.status);
        console.log(
          "Response headers:",
          Object.fromEntries([...response.headers])
        );

        if (!response.ok) {
          throw new Error(
            `Network response was not ok: ${response.status} ${response.statusText}`
          );
        }
        return response.text().then((text) => {
          console.log("Raw response:", text);
          try {
            return JSON.parse(text);
          } catch (e) {
            console.error("Error parsing JSON:", e);
            throw new Error(
              `Invalid JSON response: ${text.substring(0, 100)}...`
            );
          }
        });
      })
      .then((data) => {
        console.log("Processed response data:", data);

        if (data.success) {
          console.log(
            `Theme successfully applied to ${selectedDomains.length} domain(s)`
          );
          alert(
            `${theme} theme successfully applied to ${selectedDomains.length} domain(s)!`
          );
          form.reset();
        } else {
          console.error("Error from server:", data.error);
          alert(
            `Error: ${
              data.error ||
              "An error occurred while saving theme configuration."
            }`
          );
        }
      })
      .catch((error) => {
        console.error("Request error:", error);
        alert(`Error: ${error.message}`);
      })
      .finally(() => {
        // Kembalikan button ke state awal
        console.log("Request completed, resetting button state");
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonText;
      });
  }
}

// Fungsi untuk menyimpan meta keywords ke server, mengembalikan Promise
function saveMetaKeywords(keyword) {
  return new Promise((resolve, reject) => {
    fetch("save_meta_keywords.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        keyword: keyword,
        theme: selectedTheme,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          console.log("Keyword meta tag berhasil disimpan secara permanen");
          resolve(data);
        } else {
          console.error("Gagal menyimpan keyword meta tag:", data.error);
          reject(new Error(data.error));
        }
      })
      .catch((error) => {
        console.error("Error saving keyword meta tag:", error);
        reject(error);
      });
  });
}

function applyTheme() {
  alert(`Theme ${selectedTheme} diterapkan!`);
}

// Add Domain

document.addEventListener("DOMContentLoaded", function () {
  // Add Domain Form
  const form = document.getElementById("addDomainForm");
  const responseContainer = document.getElementById("response-container");
  const responseMessage = document.getElementById("response-message");
  const nameserversContainer = document.getElementById("nameservers-container");
  const nameserversList = document.getElementById("nameservers-list");
  const loadingSpinner = document.getElementById("loading-spinner");

  if (form) {
    form.addEventListener("submit", async function (event) {
      event.preventDefault();
      loadingSpinner.classList.remove("hidden"); // Tampilkan loading

      const formData = new FormData(form);
      const formDataObj = Object.fromEntries(formData.entries());

      try {
        const response = await fetch(form.action, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams(formDataObj),
        });

        // Pastikan respons berformat JSON
        const text = await response.text();
        let data;
        try {
          data = JSON.parse(text);
        } catch (jsonError) {
          throw new Error("Respon bukan JSON yang valid: " + text);
        }

        loadingSpinner.classList.add("hidden"); // Sembunyikan loading
        responseContainer.classList.remove("hidden");

        if (data.success) {
          responseMessage.textContent = "Domain berhasil ditambahkan!";
          responseContainer.classList.add("success");

          if (Array.isArray(data.nameservers)) {
            nameserversList.innerHTML = "";
            data.nameservers.forEach((ns) => {
              const li = document.createElement("li");
              li.textContent = ns;
              nameserversList.appendChild(li);
            });
            nameserversContainer.classList.remove("hidden");
          } else {
            nameserversContainer.classList.add("hidden");
          }
        } else {
          responseMessage.textContent =
            "Terjadi kesalahan: " + (data.error || "Tidak ada respons.");
          responseContainer.classList.add("error");
        }
      } catch (error) {
        loadingSpinner.classList.add("hidden");
        responseMessage.textContent = "Terjadi kesalahan: " + error.message;
        responseContainer.classList.add("error");
      }
    });
  }

  // Fetch Redirects
  const redirectForm = document.getElementById("redirect-form");

  if (redirectForm) {
    fetchDomains();

    redirectForm.addEventListener("submit", function (e) {
      e.preventDefault();
      updateRedirect();
    });
  }

  // Connect Check Status button
  const checkStatusBtn = document.getElementById("check-status-btn");
  if (checkStatusBtn) {
    checkStatusBtn.addEventListener("click", function () {
      checkAllDomainsStatus();
    });
  }
});

// Check domains status
async function checkAllDomainsStatus() {
  try {
    const statusBtn = document.getElementById("check-status-btn");
    if (statusBtn) {
      statusBtn.disabled = true;
      statusBtn.textContent = "Checking...";
    }

    showStatusMessage("Checking domains status...", "info");

    const response = await fetch("check_domain_status.php?action=check_all");
    if (!response.ok) {
      throw new Error("Failed to fetch domain status");
    }

    const data = await response.json();
    if (data.success) {
      showStatusMessage(
        `Successfully checked ${data.domains_checked} domains`,
        "success"
      );
      // Update status indicators in the table
      updateDomainStatusInTable(data.results);
    } else {
      showStatusMessage(
        "Error checking domains: " + (data.error || "Unknown error"),
        "error"
      );
    }
  } catch (error) {
    console.error("Error checking domain status:", error);
    showStatusMessage(
      "Error checking domain status: " + error.message,
      "error"
    );
  } finally {
    const statusBtn = document.getElementById("check-status-btn");
    if (statusBtn) {
      statusBtn.disabled = false;
      statusBtn.textContent = "Check Status";
    }
  }
}

// Update domain status in the table
function updateDomainStatusInTable(statusResults) {
  const tableRows = document.querySelectorAll("#redirect-table-body tr");
  tableRows.forEach((row) => {
    const domainName = row.dataset.domain;
    if (domainName && statusResults[domainName]) {
      const status = statusResults[domainName];

      // Update status cell
      const statusCell = row.querySelector("td:nth-child(3)");
      if (statusCell) {
        // Clear previous classes
        statusCell.className = "";

        // Set new status and class
        if (status.is_reachable) {
          statusCell.textContent = "Active";
          statusCell.classList.add("text-success");
        } else if (status.status === "pending") {
          statusCell.textContent = "Pending";
          statusCell.classList.add("text-warning");
        } else {
          statusCell.textContent = status.status || "Unknown";
          statusCell.classList.add("text-danger");
        }
      }

      // Update redirect cell if needed
      const redirectCell = row.querySelector(".redirect-to");
      if (redirectCell && status.redirect_url) {
        redirectCell.textContent = status.redirect_url;
        redirectCell.classList.remove("text-muted");
        redirectCell.classList.add("text-success");
      }
    }
  });
}

// Show status message
function showStatusMessage(message, type) {
  const statusContainer = document.getElementById("status-message");
  if (!statusContainer) return;

  statusContainer.textContent = message;
  statusContainer.className = "";

  switch (type) {
    case "success":
      statusContainer.classList.add(
        "text-green-600",
        "bg-green-100",
        "p-2",
        "rounded"
      );
      break;
    case "error":
      statusContainer.classList.add(
        "text-red-600",
        "bg-red-100",
        "p-2",
        "rounded"
      );
      break;
    case "info":
    default:
      statusContainer.classList.add(
        "text-blue-600",
        "bg-blue-100",
        "p-2",
        "rounded"
      );
      break;
  }

  statusContainer.classList.remove("hidden");

  // Auto hide after 5 seconds
  setTimeout(() => {
    statusContainer.classList.add("hidden");
  }, 5000);
}

// Bulk Content

// Constants for Pagination
const itemsPerPage = 50;
let currentPage = 1;
let domainsData = [];

// Fetch all domains from get_zones.php
async function fetchDomains() {
  try {
    showStatusMessage("Loading domains...", "info");

    const response = await fetch("get_zones.php?action=get_zones");

    if (!response.ok) throw new Error("Failed to fetch domains");

    domainsData = await response.json();
    renderTable();
    renderPagination();

    showStatusMessage(
      `Loaded ${domainsData.length} domains successfully`,
      "success"
    );
  } catch (error) {
    console.error("Error fetching domains:", error);
    showError("Error fetching domains. Please try again.");
  }
}

// Render domain table
async function renderTable() {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const domainsToDisplay = domainsData.slice(
    startIndex,
    startIndex + itemsPerPage
  );
  const redirectTableBody = document.getElementById("redirect-table-body");
  redirectTableBody.innerHTML = ""; // Clear table before rendering

  try {
    // Tampilkan indikator loading
    redirectTableBody.innerHTML =
      "<tr><td colspan='5'>Loading domains...</td></tr>";

    const redirectPromises = domainsToDisplay.map(async (domain) => {
      // Tambahkan timestamp untuk memastikan data diambil ulang
      const timestamp = new Date().getTime();
      const redirectUrl = await fetchRedirect(domain.name);
      return { domain, redirectUrl };
    });

    const results = await Promise.all(redirectPromises);

    // Bersihkan tabel
    redirectTableBody.innerHTML = "";

    results.forEach(({ domain, redirectUrl }) => {
      const row = document.createElement("tr");
      row.dataset.domain = domain.name;

      // Tampilkan "No redirect set" sebagai teks abu-abu jika tidak ada redirect
      const redirectText = redirectUrl || "No redirect set";
      const redirectClass = redirectUrl ? "text-success" : "text-muted";

      // Tentukan status dan class sesuai status dari Cloudflare
      let statusText = "Unknown";
      let statusClass = "text-muted";

      if (domain.status === "active") {
        statusText = "Active";
        statusClass = "text-success";
      } else if (
        domain.status === "pending" ||
        domain.status === "initializing"
      ) {
        statusText = "Pending";
        statusClass = "text-warning";
      } else if (domain.status === "deactivated" || domain.status === "moved") {
        statusText = "Deactivated";
        statusClass = "text-danger";
      } else if (domain.status && domain.status.includes("invalid")) {
        statusText = "Invalid Nameservers";
        statusClass = "text-danger";
      }

      row.innerHTML = `
      <td><input type="checkbox" value="${domain.name}" class="domain-checkbox"></td>
      <td>${domain.name}</td>
      <td class="${statusClass}">${statusText}</td>
      <td class="redirect-to ${redirectClass}">${redirectText}</td>
      <td class="actions">
        <button class="check-single-domain" data-domain="${domain.name}">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-repeat" viewBox="0 0 16 16">
            <path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z"/>
            <path d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z"/>
          </svg>
        </button>
      </td>
    `;

      row
        .querySelector(".domain-checkbox")
        .addEventListener("change", updateRedirectLabel);

      // Add event listener for single domain check
      row
        .querySelector(".check-single-domain")
        .addEventListener("click", function () {
          checkSingleDomainStatus(domain.name);
        });

      redirectTableBody.appendChild(row);
    });
  } catch (error) {
    console.error("Error fetching redirects:", error);
    showError("Error fetching redirect URLs. Please try again.");
  }
}

// Check status for a single domain
async function checkSingleDomainStatus(domain) {
  try {
    // Find the row and update UI to show checking
    const row = document.querySelector(`tr[data-domain="${domain}"]`);
    if (row) {
      const statusCell = row.querySelector("td:nth-child(3)");
      if (statusCell) {
        statusCell.innerHTML = `<span class="checking">Checking...</span>`;
      }
    }

    // Make API call to check domain status
    const response = await fetch(
      `check_domain_status.php?action=check_specific&domain=${domain}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch domain status");
    }

    const data = await response.json();
    if (data.success && data.results && data.results[domain]) {
      const status = data.results[domain];

      // Update row with new status information
      if (row) {
        const statusCell = row.querySelector("td:nth-child(3)");
        if (statusCell) {
          // Reset the cell
          statusCell.innerHTML = "";

          // Set new status and class
          if (status.is_reachable) {
            statusCell.textContent = "Active";
            statusCell.className = "text-success";
          } else if (status.status === "pending") {
            statusCell.textContent = "Pending";
            statusCell.className = "text-warning";
          } else {
            statusCell.textContent = status.status || "Unknown";
            statusCell.className = "text-danger";
          }
        }

        // Update redirect cell if needed
        const redirectCell = row.querySelector(".redirect-to");
        if (redirectCell && status.redirect_url) {
          redirectCell.textContent = status.redirect_url;
          redirectCell.className = "redirect-to text-success";
        }
      }

      showStatusMessage(`Status check completed for ${domain}`, "success");
    } else {
      showStatusMessage(`Failed to check status for ${domain}`, "error");

      // Reset the status cell
      if (row) {
        const statusCell = row.querySelector("td:nth-child(3)");
        if (statusCell) {
          statusCell.textContent = "Unknown";
          statusCell.className = "text-muted";
        }
      }
    }
  } catch (error) {
    console.error(`Error checking status for ${domain}:`, error);
    showStatusMessage(
      `Error checking status for ${domain}: ${error.message}`,
      "error"
    );
  }
}

// Fetch the redirect URL for a domain
async function fetchRedirect(domain) {
  try {
    // Tambahkan parameter nocache untuk benar-benar menghindari cache
    const response = await fetch(
      `get_redirects.php?action=get_redirects&domain=${domain}&nocache=${new Date().getTime()}`
    );

    if (!response.ok) {
      console.error("Response not OK:", await response.text());
      throw new Error("Failed to fetch redirect");
    }

    const data = await response.json();
    console.log("Redirect data for", domain, ":", data); // Tambahkan logging
    return data.redirect || null;
  } catch (error) {
    console.error("Error fetching redirect for", domain, ":", error);
    return null;
  }
}

// Render pagination
function renderPagination() {
  const totalPages = Math.ceil(domainsData.length / itemsPerPage);
  const paginationContainer = document.getElementById("pagination");
  paginationContainer.innerHTML = ""; // Clear pagination

  if (totalPages <= 1) return; // No pagination needed if only 1 page

  // Create Previous button
  paginationContainer.appendChild(
    createPaginationButton("Previous", currentPage > 1, () =>
      changePage(currentPage - 1)
    )
  );

  // Create page buttons
  for (let i = 1; i <= totalPages; i++) {
    paginationContainer.appendChild(
      createPaginationButton(i, i !== currentPage, () => changePage(i))
    );
  }

  // Create Next button
  paginationContainer.appendChild(
    createPaginationButton("Next", currentPage < totalPages, () =>
      changePage(currentPage + 1)
    )
  );
}

// Helper function to create pagination buttons
function createPaginationButton(text, enabled, callback) {
  const button = document.createElement("button");
  button.textContent = text;
  button.disabled = !enabled;
  button.classList.add("pagination-button");
  if (enabled) button.addEventListener("click", callback);
  return button;
}

// Change page function
function changePage(pageNumber) {
  const totalPages = Math.ceil(domainsData.length / itemsPerPage);
  if (pageNumber < 1 || pageNumber > totalPages) return;
  currentPage = pageNumber;
  renderTable();
  renderPagination();
}

// Select/Deselect all checkboxes
function toggleSelectAll(checkbox) {
  const isChecked = checkbox.checked;
  document.querySelectorAll(".domain-checkbox").forEach((cb) => {
    cb.checked = isChecked;
  });
  updateRedirectLabel();
}

// Update redirect label
function updateRedirectLabel() {
  const redirectUrlInput = document.getElementById("edit-redirect-url");
  const submitButton = document.getElementById("submit-btn");
  const checkedBoxes = document.querySelectorAll(".domain-checkbox:checked");

  submitButton.disabled = checkedBoxes.length === 0;
  redirectUrlInput.value =
    checkedBoxes.length === 1
      ? document.querySelector(
          `tr[data-domain="${checkedBoxes[0].value}"] .redirect-to`
        ).textContent
      : "";
}

// Update redirects in bulk
async function updateRedirect() {
  const selectedDomains = Array.from(
    document.querySelectorAll(".domain-checkbox:checked")
  ).map((el) => el.value);
  const redirectTo = document.getElementById("edit-redirect-url").value;
  const submitButton = document.getElementById("submit-btn");
  const spinner = document.getElementById("redirect-loading-spinner");

  // Validasi apakah URL dimulai dengan "https://"
  if (!redirectTo.startsWith("https://")) {
    alert("Gunakan 'https://' di awal URL redirect!");
    return;
  }

  if (selectedDomains.length === 0 || !redirectTo) {
    alert("Pilih setidaknya satu domain dan masukkan URL redirect yang valid.");
    return;
  }

  submitButton.disabled = true;
  spinner.classList.remove("hidden");

  // Log data yang akan dikirim untuk debugging
  console.log("Sending data to server:", {
    domains: selectedDomains,
    redirect_to: redirectTo,
  });

  try {
    // Tambahkan timestamp untuk menghindari cache
    const timestamp = new Date().getTime();
    const fetchUrl = `update_redirects.php?_=${timestamp}`;

    const response = await fetch(fetchUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        domains: selectedDomains,
        redirect_to: redirectTo,
      }),
    });

    // Log response status untuk debugging
    console.log("Response status:", response.status, response.statusText);

    // Tangkap response text terlebih dahulu
    const responseText = await response.text();
    console.log("Raw response:", responseText);

    // Coba parse response sebagai JSON
    let result;
    try {
      result = JSON.parse(responseText);
    } catch (parseError) {
      console.error("Failed to parse response as JSON:", responseText);
      throw new Error(
        `Server returned invalid JSON response. This might indicate a server error. Raw response: ${responseText.substring(
          0,
          100
        )}...`
      );
    }

    // Validasi hasil respons
    if (!response.ok) {
      throw new Error(
        result.error ||
          `Server returned status ${response.status}: ${response.statusText}`
      );
    }

    if (!result.success) {
      throw new Error(
        result.error || "Operation failed without specific error message"
      );
    }

    // Log hasil sukses untuk debugging
    console.log("Update successful:", result);

    // Perbarui UI langsung untuk domain yang dipilih
    selectedDomains.forEach((domain) => {
      const redirectCell = document.querySelector(
        `tr[data-domain="${domain}"] .redirect-to`
      );
      if (redirectCell) {
        redirectCell.textContent = redirectTo;
        redirectCell.classList.remove("text-muted");
        redirectCell.classList.add("text-success");
      }
    });

    // Perform a status check for updated domains
    setTimeout(() => {
      checkSelectedDomainsStatus(selectedDomains);
    }, 2000); // Wait 2 seconds to let Cloudflare process the changes

    showSuccess("Redirect berhasil diupdate!");
  } catch (error) {
    console.error("Error updating redirect:", error);

    // Tampilkan pesan error yang lebih deskriptif
    let errorMessage = error.message;

    // Deteksi jenis error yang umum
    if (
      errorMessage.includes("Failed to fetch") ||
      errorMessage.includes("NetworkError")
    ) {
      errorMessage =
        "Koneksi ke server gagal. Periksa koneksi internet Anda dan coba lagi.";
    } else if (errorMessage.includes("<!DOCTYPE")) {
      errorMessage =
        "Server mengembalikan halaman HTML alih-alih data JSON. Ini mungkin menunjukkan masalah pada server atau file PHP.";
    }

    // Tampilkan error di UI
    showError(`Gagal mengupdate redirect: ${errorMessage}`);

    // Notifikasi untuk user
    alert(`Error updating redirects: ${errorMessage}`);
  } finally {
    submitButton.disabled = false;
    spinner.classList.add("hidden");
  }
}

// Check status for selected domains
async function checkSelectedDomainsStatus(domains) {
  showStatusMessage("Checking updated domains status...", "info");

  // Create a URL with all domain parameters
  const domainParams = domains
    .map((domain) => `domains[]=${encodeURIComponent(domain)}`)
    .join("&");
  const url = `check_domain_status.php?action=check_specific&${domainParams}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to check domain status");
    }

    const data = await response.json();
    if (data.success) {
      updateDomainStatusInTable(data.results);
      showStatusMessage(
        `Status updated for ${domains.length} domain(s)`,
        "success"
      );
    } else {
      showStatusMessage("Failed to get updated status", "error");
    }
  } catch (error) {
    console.error("Error checking status for updated domains:", error);
    showStatusMessage("Error updating status: " + error.message, "error");
  }
}

// Show success message on the page
function showSuccess(message) {
  const feedbackMessage = document.getElementById("feedback-message");
  if (feedbackMessage) {
    feedbackMessage.textContent = message;
    feedbackMessage.style.color = "green";
    feedbackMessage.classList.remove("hidden");

    // Sembunyikan pesan setelah 5 detik
    setTimeout(() => {
      feedbackMessage.classList.add("hidden");
    }, 5000);
  }
}

// Show error message on the page
function showError(message) {
  const feedbackMessage = document.getElementById("feedback-message");
  if (feedbackMessage) {
    feedbackMessage.textContent = message;
    feedbackMessage.style.color = "red";
    feedbackMessage.classList.remove("hidden");
  }

  // Log error untuk debugging
  console.error("Error message displayed:", message);
}
