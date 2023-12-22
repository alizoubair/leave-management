@component('mail::message')
# Bienvenue

Votre inscription dans l'application a été bien prise en compte.

@component('mail::button', ['url' => 'http://localhost:4200/'])
Connectez-vous
@endcomponent

Merci,<br>
{{ config('app.name') }}
@endcomponent
