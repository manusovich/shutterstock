function job() {
    shutterstockStat.updateCount();
    setTimeout(function () {job()}, 300000);
}

// Run our kitten generation script as soon as the document's DOM is ready.
document.addEventListener('DOMContentLoaded', function () {
    job();
});





