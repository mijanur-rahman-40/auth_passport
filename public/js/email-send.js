
var clientId = '592822109196-sodbu2iko1fnujdam52ich4qaqo53ekj.apps.googleusercontent.com';
var apiKey = 'AIzaSyBGUuscf8xHiBCgHHGtklpFs-gXtXhtreA';
var scopes = 'https://www.googleapis.com/auth/gmail.readonly ' +
    'https://www.googleapis.com/auth/gmail.send';

function handleClientLoad()
{
    gapi.client.setApiKey(apiKey);
    window.setTimeout(checkAuth, 1);
}

function checkAuth()
{
    gapi.auth.authorize({
        client_id: clientId,
        scope: scopes,
        immediate: true
    }, handleAuthResult);
}

function handleAuthClick()
{
    gapi.auth.authorize({
        client_id: clientId,
        scope: scopes,
        immediate: false
    }, handleAuthResult);
    return false;
}

function handleAuthResult(authResult)
{
    if (authResult && !authResult.error) {
        loadGmailApi();
        console.log(authResult.error)
        $('#authorize-button').remove();
        $('.table-inbox').removeClass("hidden");
        $('#compose-button').removeClass("hidden");
    } else {
        $('#authorize-button').removeClass("hidden");
        $('#authorize-button').on('click', function ()
        {
            handleAuthClick();
        });
    }
}

function loadGmailApi()
{
    gapi.client.load('gmail', 'v1', displayInbox);
}

function displayInbox()
{
    var request = gapi.client.gmail.users.messages.list({
        'userId': 'me',
        'labelIds': 'INBOX',
        'maxResults': 10
    });
    request.execute(function (response)
    {
        $.each(response.messages, function ()
        {
            var messageRequest = gapi.client.gmail.users.messages.get({
                'userId': 'me',
                'id': this.id
            });
            messageRequest.execute(appendMessageRow);
        });
    });
}

function sendEmail()
{
    $('#send-button').addClass('disabled');

    sendMessage(
        {
            'To': [$('#compose-to').val()],
            'Subject': $('#compose-subject').val()
        },
        $('#compose-message').val(),
        composeTidy
    );

    return false;
}

function composeTidy()
{
    $('#compose-modal').modal('hide');

    $('#compose-to').val('');
    $('#compose-subject').val('');
    $('#compose-message').val('');

    $('#send-button').removeClass('disabled');
}

function sendMessage(headers_obj, message, callback)
{
    var email = '';

    for (var header in headers_obj)
        email += header += ": " + headers_obj[header] + "\r\n";

    email += "\r\n" + message;

    var sendRequest = gapi.client.gmail.users.messages.send({
        'userId': 'me',
        'resource': {
            'raw': window.btoa(email).replace(/\+/g, '-').replace(/\//g, '_')
        }
    });

    return sendRequest.execute(callback);
}

function getHeader(headers, index)
{
    var header = '';
    $.each(headers, function ()
    {
        if (this.name.toLowerCase() === index.toLowerCase()) {
            header = this.value;
        }
    });
    return header;
}

function getBody(message)
{
    var encodedBody = '';
    if (typeof message.parts === 'undefined') {
        encodedBody = message.body.data;
    }
    else {
        encodedBody = getHTMLPart(message.parts);
    }
    encodedBody = encodedBody.replace(/-/g, '+').replace(/_/g, '/').replace(/\s/g, '');
    return decodeURIComponent(escape(window.atob(encodedBody)));
}


