function job() {
    shutterstockStat.updateCount();

    /**
     * select random time from period of 4-6 minutes for next request
     */
    var time = 60000 * 4 + Math.floor((Math.random() * 60000 * 2) + 1);
    console.log("Wait " + time + " ms. before next attempt");
    setTimeout(function () {job()}, time);
}

// Run our kitten generation script as soon as the document's DOM is ready.
document.addEventListener('DOMContentLoaded', function () {
    job();
});





