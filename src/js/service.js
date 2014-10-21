"use strict";
function setupService(service, url, el, settings) {
    var href = el.href;
    // just open url in case of errors
    if ($("#" + service + "-profile").length > 0) {
        window.location = href;
        return;
    }
    if (!window[service + "Service"]) {
        console.error("Service Not Found:", service);
        window.location = href;
        return;
    }
    // set $service to the current service object
    var $service = window[formatModuleName(service) + "Service"];
    // show spinner
    var spinner = new Spinner(spin_opts).spin();
    $("#" + service + "-item-link").append(spinner.el);
    var promises = [
        $service.fetch(settings),
        asyncText("templates/" + $service.template)
    ];
    if ($service.supportMore)
        promises.push(asyncText("templates/" + $service.templateMore));
    // request templates && fetch service data
    Promise.all(promises).then(function (results) {
        var serviceData = results[0], view = results[1], viewMore = results[2];
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
        $modal = $(template(serviceData)).modal().on("hidden.bs.modal", function () {
            $(this).remove();
            if (currSelection === service) {
                adjustSelection("home");
            }
        });
        // If service support fetching more data
        if ($service.supportMore) {
            var moreTemplate = Handlebars.compile(viewMore);
            $modal.find("#load-more-data").click(function (e) {
                var spinnerMore = new Spinner(spin_opts).spin();
                $(this).append(spinnerMore.el);
                // fetch more service data && add it to the modal
                $service.fetchMore(settings).then(function (serviceMoreData) {
                    serviceMoreData = $service.setupMore(serviceMoreData, settings);
                    $("." + service + " .profile-data").append(moreTemplate(serviceMoreData));
                    spinnerMore.stop();
                }).catch(function (error) {
                    if (error === NO_MORE_DATA) {
                        $(this).remove();
                    }
                    spinnerMore.stop();
                });
            });
        }
        spinner.stop();
        console.info("Service Setuped:", service);
    }).catch(function (error) {
        //TODO
        console.error("Service Not Setuped:", service);
    });
}
