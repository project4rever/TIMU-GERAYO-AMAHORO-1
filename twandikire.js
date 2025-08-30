/**
 * Twandikire Feedback Page
 * Secure, clean, and accessible comment system using localStorage
 */

document.addEventListener("DOMContentLoaded", () => {
  const commentsBox = document.getElementById("commentsBox");
  const commentForm = document.getElementById("commentForm");
  const commentInput = document.getElementById("commentInput");

  // Load comments safely from localStorage
  const loadComments = () => {
    try {
      const saved = localStorage.getItem("twandikire_comments");
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.warn("Failed to parse comments from localStorage", e);
      return [];
    }
  };

  // Save comments safely
  const saveComments = (comments) => {
    try {
      localStorage.setItem("twandikire_comments", JSON.stringify(comments));
    } catch (e) {
      console.error("Failed to save comments to localStorage", e);
      alert("Kwiyandikisha kibonetse. Gerageza kandi ukomeza.");
    }
  };

  let comments = loadComments();

  // Display all comments
  const displayComments = () => {
    commentsBox.innerHTML = "";

    if (comments.length === 0) {
      const emptyMsg = document.createElement("p");
      emptyMsg.textContent = "Ntabwo abantu bageje gukemura ibitekerezo.";
      emptyMsg.style.textAlign = "center";
      emptyMsg.style.color = "#aaa";
      emptyMsg.style.fontStyle = "italic";
      commentsBox.appendChild(emptyMsg);
      return;
    }

    comments.forEach((comment, index) => {
      const card = document.createElement("div");
      card.className = "comment-card";
      card.setAttribute("role", "listitem");
      card.innerHTML = `
        <div class="comment-number">#${index + 1}</div>
        <div class="comment-text">${escapeHtml(comment)}</div>
      `;
      commentsBox.appendChild(card);
    });
  };

  // Prevent XSS: Sanitize user input
  const escapeHtml = (text) => {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  };

  // Handle form submission
  commentForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const value = commentInput.value.trim();

    if (value) {
      comments.push(value);
      saveComments(comments);
      commentInput.value = "";
      displayComments();
    }
  });

  // Initial render
  displayComments();
});