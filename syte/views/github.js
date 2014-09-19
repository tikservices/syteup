function github(request, username) {
    var user_r = new XMLHttpRequest(),
	repos_r = new XMLHttpRequest(),
        context = {};

    user_r.open('GET', settings.GITHUB_API_URL + 'users/' +  username, true);
    user_r.onload = function() {
	    if (this.status != 200 ) return;
	    context.user = this.reponse;
    };

    repos_r.open('GET', settings.GITHUB_API_URL + 'users/' + username + '/repos', true);
    repos_r.onload = function() {
	    if (this.status != 200 ) return;
	    context.user = this.reponse;
    }

    user_r.send();
    repos_r.send()

    context['repos'].sort(function(r1, r2) { return r1.updated_at > r2.updated_at });
    return context;
}

/*
def github_auth(request):
    context = dict()
    code = request.GET.get('code', None)
    error = request.GET.get('error_description', None)

    if not code and not error:
        return redirect('{0}?client_id={1}&redirect_uri={2}github/auth/&response_type=code'.format(
            settings.GITHUB_OAUTH_AUTHORIZE_URL,
            settings.GITHUB_CLIENT_ID,
            settings.SITE_ROOT_URI))

    if code:
        r = requests.post(settings.GITHUB_OAUTH_ACCESS_TOKEN_URL, data={
            'client_id': settings.GITHUB_CLIENT_ID,
            'client_secret': settings.GITHUB_CLIENT_SECRET,
            'redirect_uri': '{0}github/auth/'.format(settings.SITE_ROOT_URI),
            'code': code,
        }, headers={'Accept': 'application/json'})

        try:
            data = r.json()
            error = data.get('error', None)
        except:
            error = r.text

        if not error:
            context['token'] = data['access_token']

    if error:
        context['error'] = error

    return render(request, 'github_auth.html', context)
*/
