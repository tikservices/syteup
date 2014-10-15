Basic steps to add support for a particular service:

1. Add information to
    [README](https://github.com/rigoneri/syte/blob/master/README.md)
2. Add setting to turn service on/off to "services"
    in [config.json](https://github.com/rigoneri/syte/blob/master/src/config.json)
3. Add above setting to "services_settings" in
    [config.json](https://github.com/rigoneri/syte/blob/master/src/config.json)
6. Write js file/function to fetch and setup service data in
    [services/](https://github.com/rigoneri/syte/tree/master/src/services)
10. Add html template to
    [templates](https://github.com/rigoneri/syte/tree/master/src/templates) to be rendered using fetched and setuped service data
