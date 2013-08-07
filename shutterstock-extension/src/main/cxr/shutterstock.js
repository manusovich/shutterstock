var shutterstockStat = {
    sendData: function (data) {
        var req = new XMLHttpRequest();
        req.open("POST", "http://localhost:8080/shutterstock-client/extension", true);
        req.send(data);
    },

    formatDate: function (d) {
        var curr_date = d.getDate();
        var curr_month = d.getMonth() + 1;
        var curr_year = d.getFullYear();
        return curr_year + "-" + curr_month + "-" + curr_date;
    },

    requestShutterstock: function () {
        var req = new XMLHttpRequest();
        req.open("GET", "https://submit.shutterstock.com/stats_date.mhtml?date="
            + this.formatDate(new Date()), true);
        req.onload = this.showPhotos_.bind(this);
        req.send(null);
    },

    addImage: function (pos, root) {
        var imgSrc = $('td:nth-child(' + pos + ') img.thumb_image', root).attr("src");
        var img = $('<img>');
        img.attr('src', imgSrc);
        img.appendTo('#output');
    },


    updateCount: function () {
        var req = new XMLHttpRequest();
        req.open("GET", "https://submit.shutterstock.com/stats_date.mhtml?date="
            + this.formatDate(new Date()), true);
        req.onload = this.displayCount_.bind(this);
        req.send(null);
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
    },


    drawIcon: function (v) {
        var canvas = document.getElementById('canvas');
        var context = canvas.getContext('2d');

        context.clearRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = "blue";

        if (v < 100) {
            context.font = "16px Arial Bold";
            context.fillText("" + v, 0, 15);
        } else if (v < 1000) {
            context.font = "11px Arial";
            context.fillText("" + v, 0, 14);
        } else {
            context.font = "8px Arial";
            context.fillText(">999", 0, 14);
        }

        var imageData = context.getImageData(0, 0, 19, 19);
        chrome.browserAction.setIcon({
            imageData: imageData
        });
    },


    showPhotos_: function (e) {
        var text = e.target.responseText;
        var $dom = $('<html>').html(text);
        var cnt = 0;
        var shtr = this;
        $('.shutterstock_submit_page table tr', $dom).each(function () {
            var t = $('td:nth-child(1)', $(this));
            if (t.text().indexOf('[') == 0) {
                var text3 = t.text().substring(2, t.text().length);
                cnt += parseInt(text3.substring(0, text3.indexOf(' ')));
            }

            var k = 0;
            $('td.datacellsm', $(this)).each(function () {
                k = 1;
            });
            if (k > 0) {
                shtr.addImage(2, $(this));
                shtr.addImage(7, $(this));
            }
        });
        this.drawIcon(cnt);
        $('#cnt').text(cnt);
    }
};
