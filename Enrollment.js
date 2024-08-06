document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const courseId = urlParams.get('id');

    document.getElementById('start-learning-button').addEventListener('click', () => {
        window.location.href = `learning.html?id=${courseId}`;
    });
});
