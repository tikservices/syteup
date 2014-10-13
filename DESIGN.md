- Syteup options & components settings are available on config.json file
- Syteup supports three different types of modules: blogs, services and plugins
    - blog: show user personal blog post on Home section (default section),
      Syteup currently support showing only a one blog platform posts ('blog_platform': bogger or tumblr or wordpress,...)
      every blog platform settings are added to 'blogs_settings'.<blog_platform_name>
    - services: services are defined on 'services' option as boolean items
      (enabled or disabled), every service settings are availbale at 'services_settings'.<service_name>
    - plugins: add some extra functions to Syteup (RSS, Domain Tracking,
      Analytics,...), they are independent of any service and loaded after services, they are define on 'plugins' option as boolean item (enabled or disabled), and every plugin settigns are availbale at 'plugins_settings'.<plugin_name>

- Structure of a blog module
    - TODO LATER

- Structure of a service module
    - config.json : services.<service_name> : boolean (enabled/disabled)
    - config.json : services_settings.<service_name> : object of service
      settings to be passed to service obj functs later
    - services/<service-name>.js : window.<serviceName>Service object
      called by setupService for to manipulate service template
      - window.<serviceName>Service.displayName: display name of service (with
	up case letters and special letter
      - window.<serviceName>Service.setup: funct to setup fetched data to be
	passed to the template
      - window.<serviceName>Service.fetch: funct to fetch data from service
	server
      - window.<serviceName>Service.template: file name of template inside
	templates/
      - window.<serviceName>Service.supportMore: (optional) bool setted to true if service
	module support showing more data (with 'Load More...' button)
      - window.<serviceName>Service.setupMore: (optional) funct to setup fetched more data to be
	passed to the more template
      - window.<serviceName>Service.fetchMore: (optional) funct to fetch more data from service
	server
      - window.<serviceName>Service.templateMore: (optional) file name of more template inside
	templates/
    - templates/<service-name>.html : service template to
      insert data into and show it by syteup
    - templates/<services-name>-more.html : (optional) service template to show
      more items

- Structure of a plugin module
    - plugins/<plugin-name>.js

OLD DESIGN DOCUMENTATION, TO DELETE LATTER

- All JS behavior is kicked off by the call to fetchBlogPosts() (syte/static/js/components/blog-posts.js)

    - This function is added with JQuery after page finishes loading.

- fetchBlogPosts() handles:

    - Setting up the handlebars template 'environment', etc.
    - Then calls setupLinks()

- setupLinks() is main entry point for the supported services

    - This attaches behavior to the click event of all 'a' tags.
    - Each click event will determine if it's a link for one of the supported
      services.
    - If the click is for a supported service:

        - All other service modal dialogs are hidden and the setup* function
            for the specified service is called.

    - The setup* function for the service is in charge of:

        - Querying server-side endpoint for the service and populating
            handlebar.js context with json returned.
        - Rendering template for service with handlebar.js

