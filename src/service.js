"use strict";

function setupService(service, url, el, settings) {
    var href = el.href;

    // just open url in case of errors
    if ($("#" + service + "-profile").length > 0) {
        window.location = href;
        return;
    }
    if (!window[service + "Service"]) {
        window.location = href;
        return;
    }

    // set $service to the current service object
    var $service = window[service + "Service"];

    // show spinner
    var spinner = new Spinner(spin_opts).spin();
    $("#" + service + "-link").append(spinner.el);

    var requireArgs = ["text!" + $service.template];
    if ($service.supportMore)
        requireArgs.push("text!" + $service.templateMore);

    // request templates && fetch service data
    Promise.all([
        $service.fetch(settings),
        new Promise(function(resolve, reject) {
            require(requireArgs,
                function serviceRequireCallback(view, viewMore) {
                    resolve([view, viewMore]);
                });
        })
    ]).then(function(results) {
        var serviceData = results[0],
            view = results[1][0],
            viewMore = results[1][1];
        var $modal;

        if (!serviceData || serviceData.error) {
            window.location = href;
            return;
        }

        // compile the current view template
        var template = Handlebars.compile(view);

        // setup the template data
        serviceData = $service.setup(serviceData, settings);
        if (!serviceData) {
            window.location = href;
            return;
        }
        $modal = $(template(serviceData)).modal().on("hidden.bs.modal", function() {
            $(this).remove();
            if (currSelection === service) {
                adjustSelection("home");
            }
        });

        // If service support fetching more data
        if ($service.supportMore) {
            // compile the template for More data
            var moreTemplate = Handlebars.compile(viewMore);

            var spinnerMore = new Spinner(spin_opts).spin();
            $("#load-more-data").append(spinnerMore.el);

            // fetch more service data && add it to the modal
            $service.fetchMore(settings).then(function(serviceMoreData) {
                $("." + service + " .profile-data").append(moreTemplate(serviceMoreData, settings));
                spinnerMore.stop();
            }).catch(function(error) {
                if (error === NO_MORE_DATA) {
                    $("." + service + " #load-more-data").remove();
                }
                spinnerMore.stop();
            });

        }

        spinner.stop();
    }).catch(function(error) {
        //TODO
    });
}
