@component('mail::message')
# Bienvenue

Votre avez été inscrit dans l'application.

Vos identifiants pour vous connectez sont :

Email : {{$user->email}}

Mot de passe : {{$userPassword}}

Vous pourrez les modifiez une fois connecté.

@component('mail::button', ['url' => 'http://localhost:4200/'])
Connectez-vous
@endcomponent

Merci,<br>
{{ config('app.name') }}
@endcomponent
