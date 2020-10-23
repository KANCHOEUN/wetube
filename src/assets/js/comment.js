import axios from "axios";

const addCommentForm = document.getElementById("jsAddComment");
const commentList = document.getElementById("jsCommentList");
const deleteComments = document.querySelectorAll("span.delete__comment > a");
const commentNumber = document.getElementById("jsCommentNumber");

const decreaseNumber = () => {
  commentNumber.innerHTML = parseInt(commentNumber.innerHTML) - 1;
};

const deleteComment = (element) => {
  element.parentElement.parentElement.remove();
  decreaseNumber();
};

const getComment = async (event) => {
  event.preventDefault();
  const commentId = event.target.parentElement.href.split("/")[4];
  const response = await axios({
    url: `/api/${commentId}/delete-comment`,
    method: "GET",
  });
  if (response.status === 200) {
    deleteComment(event.target.parentElement);
  }
};

const increaseNumber = () => {
  commentNumber.innerHTML = parseInt(commentNumber.innerHTML) + 1;
};

const addComment = (comment) => {
  const li = document.createElement("li");
  const span = document.createElement("span");
  const removeSpan = document.createElement("span");
  const removeAnchor = document.createElement("a");
  const removeButton = document.createElement("button");
  span.className = "text__comment";
  span.innerHTML = comment.text;
  removeSpan.className = "delete__comment";
  removeAnchor.href = `/api/${comment._id}/delete-comment`;
  removeButton.innerHTML = "❌";
  li.appendChild(span);
  li.appendChild(removeSpan);
  removeSpan.appendChild(removeAnchor);
  removeAnchor.appendChild(removeButton);
  commentList.prepend(li);
  removeButton.addEventListener("click", getComment);
  increaseNumber();
};

const sendComment = async (comment) => {
  const videoId = window.location.href.split("/videos/")[1];
  const response = await axios({
    url: `/api/${videoId}/comment`,
    method: "POST",
    data: {
      comment,
    },
  });
  if (response.status === 200) {
    addComment(response.data);
  }
};

const handleSubmit = (event) => {
  event.preventDefault();
  const commentInput = addCommentForm.querySelector("input");
  const comment = commentInput.value;
  sendComment(comment);
  commentInput.value = "";
};

function init() {
  addCommentForm.addEventListener("submit", handleSubmit);
  deleteComments.forEach((deleteButton) => {
    deleteButton.addEventListener("click", getComment);
  });
}

if (addCommentForm) {
  init();
}
