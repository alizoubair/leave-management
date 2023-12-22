@component('mail::message')
# Demande de congé

Votre demande de congé du {{$conge->date_debut}} au {{$conge->date_fin}} n'a pas été acceptée.


@component('mail::button', ['url' => 'http://localhost:4200/'])
Connectez-vous pour faire une autre demande
@endcomponent

Merci,<br>
{{ config('app.name') }}
@endcomponent
