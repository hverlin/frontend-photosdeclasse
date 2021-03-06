var config = {
    name: "Photos de classe",
    photoPrice: 3,
    api: {
        url: "https://backend-graines-hverlin.c9.io/v1"
    },
    frontend:{
        url:"http://commandes-photos.grainesdimages.fr"
    }
};

var util = {
    naturalSort: function(a, b) {
        var NUMBER_GROUPS = /(-?\d*\.?\d+)/g;

        var aa = String(a).split(NUMBER_GROUPS),
            bb = String(b).split(NUMBER_GROUPS),
            min = Math.min(aa.length, bb.length);

        for (var i = 0; i < min; i++) {
            var x = parseFloat(aa[i]) || aa[i].toLowerCase(),
                y = parseFloat(bb[i]) || bb[i].toLowerCase();
            if (x < y) return -1;
            else if (x > y) return 1;
        }

        return 0;
    },

    gridHeight: function() {
        return window.innerHeight - 52;
    }

};