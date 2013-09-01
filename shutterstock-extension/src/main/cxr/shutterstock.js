var silentHours = [1, 2, 3, 4, 5, 6, 7];

var shutterstockStat = {
    formatDate: function (d) {
        var curr_date = d.getDate();
        var curr_month = d.getMonth() + 1;
        var curr_year = d.getFullYear();
        return curr_year + "-" + curr_month + "-" + curr_date;
    },

    checkSilent: function () {
        var hours = new Date().getHours();
        console.log("Now (" + hours + " hours)");
        for (var i = 0; i < silentHours.length; i++) {
            if (silentHours[i] == new Date().getHours()) {
                return true;
            }
        }
        return false;
    },

    getTodayStatsLink: function () {
        return "https://submit.shutterstock.com/stats_date.mhtml?date="
        + this.formatDate(new Date());
    },

    requestShutterstock: function () {
        var req = new XMLHttpRequest();
        req.open("GET", this.getTodayStatsLink(), true);
        req.onload = this.showPhotos_.bind(this);
        req.send(null);
    },

    updateCount: function () {
        if (!this.checkSilent()) {
            var req = new XMLHttpRequest();
            req.open("GET", "https://submit.shutterstock.com/stats_date.mhtml?date="
                + this.formatDate(new Date()), true);
            req.onload = this.displayCount_.bind(this);
            req.send(null);
        } else {
            this.drawIcon("S"); // Sleeping time
        }
    },

    addImage: function (pos, root) {
        var imgSrc = $('td:nth-child(' + pos + ') img.thumb_image', root).attr("src");
        var img = $('<img>');
        img.attr('src', imgSrc);
        img.attr('class', "shutterstock-image");
        img.prependTo('#output');
    },


    displayCount_: function (e) {
        var text = e.target.responseText;
        var $dom = $('<html>').html(text);
        var cnt = 0;
        $('.shutterstock_submit_page table tr', $dom).each(function () {
            var t = $('td:nth-child(1)', $(this));
            if (t.text().indexOf('[') == 0) {
                var text3 = t.text().substring(2, t.text().length);
                cnt += parseInt(text3.substring(0, text3.indexOf(' ')));
            }
        });
        this.drawIcon(cnt);

        /**
         * Send request for shell plugin
         */
        var req = new XMLHttpRequest();
        req.open("GET", "http://localhost:8757?tray=" + cnt);
        req.onload = null;
        req.send(null);
    },


    drawIcon: function (v) {
        var canvas = document.getElementById('canvas');
        var context = canvas.getContext('2d');

        context.clearRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = "gray";

        if (isNaN(v)) {
            context.font = "16px Arial";
            context.fillText(v, 0, 15);
        } else {
            if (v < 100) {
                context.font = "16px Arial Bold";
                context.fillText("" + v, 0, 15);
            } else if (v != "-" && v < 1000) {
                context.font = "11px Arial";
                context.fillText("" + v, 0, 14);
            } else {
                context.font = "8px Arial";
                context.fillText(">999", 0, 14);
            }
        }

        var imageData = context.getImageData(0, 0, 19, 19);
        chrome.browserAction.setIcon({
            imageData: imageData
        });
    },


    showPhotos_: function (e) {
        var text = e.target.responseText;
        var $dom = $('<html>').html(text);

        /**
         * Extract earnings
         */
        var earnings = $('li.earnings h1:nth-child(2)', $dom).text();
        $('#shutterstock-earnings').empty().append(earnings);

        /**
         * Extract all downloads
         */
        var cnt = 0;
        var shtr = this;
        var i = 0;
        $('.shutterstock_submit_page table table tr', $dom).each(function () {
            var t = $('td:nth-child(1)', $(this));
            if (t.text().indexOf('[') == 0) {
                var text3 = t.text().substring(2, t.text().length);
                cnt += parseInt(text3.substring(0, text3.indexOf(' ')));
            } else {
                var k = 0;
                $('td.datacellsm', $(this)).each(function () {
                    k = 1;
                });
                if (k > 0) {
                    shtr.addImage(2, $(this));
                    shtr.addImage(7, $(this));
                }
            }


           i++;
        });
        this.drawIcon(cnt);

        /**
         * Total counts
         */
        var countLink = $('<a>');
        countLink.attr('href', this.getTodayStatsLink());
        countLink.text(cnt);
        $('#shutterstock-cnt').empty().append(countLink);
    }
};
