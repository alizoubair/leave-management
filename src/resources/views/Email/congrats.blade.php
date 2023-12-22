@component('mail::message')
# Félicitations

Votre demande de congé du {{$conge->date_debut}} au {{$conge->date_fin}} a été acceptée.

@component('mail::button', ['url' => 'http://localhost:4200/'])
Connectez-vous
@endcomponent

Merci,<br>
{{ config('app.name') }}
@endcomponent
