"use strict";

function setupFoursquare(rl, el, settings) {
    var href = el.href;

    var spinner = new Spinner(spin_opts).spin();
    $("#foursquare-link").append(spinner.el);

    require(["views/foursquare.js",
            "text!templates/foursquare-profile.html"
        ],
        function(foursquare, foursquare_profile) {
            foursquare(settings).then(function(foursquare_data) {

                if (!foursquare_data.checkins) {
                    window.location = href;
                    return;
                }

                var template = Handlebars.compile(foursquare_profile);

                var photo_dict = foursquare_data.user["photo"];
                if (photo_dict) {
                    //foursquare api returned me a wrong prefix url so check the url with your foursquare profile.
                    foursquare_data.user["photoURL"] = "https://is0.4sqi.net/userpix_thumbs" + photo_dict.suffix;
                }

                $.each(foursquare_data.checkins.items, function(i, c) {
                    c.formated_date = moment.unix(parseInt(c.createdAt)).fromNow();

                    if (c.venue) {
                        var category = c.venue["categories"][0];
                        if (category) {
                            var prefix = category.icon.prefix + "bg_32";
                            if (prefix.substring(prefix.length - 1) === "_") {
                                prefix = prefix.substring(0, prefix.length - 1);
                            }
                            c.venue.venueImageURL = prefix + category.icon.suffix;
                            c.venue.categoryName = category.shortName;
                        }
                    }
                });

                $(template(foursquare_data)).modal().on("hidden.bs.modal", function() {
                    $(this).remove();
                    if (currSelection === "foursquare") {
                        adjustSelection("home");
                    }
                });

                spinner.stop();

                return;
            });
        });
}
