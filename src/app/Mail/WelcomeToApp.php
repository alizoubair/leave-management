<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class WelcomeToApp extends Mailable
{
    use Queueable, SerializesModels;
    public $user;
    public $userPassword;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($user,$userPassword)
    {
        $this->user = $user;
        $this->userPassword = $userPassword;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->subject('Bienvenue - Gestion de congés')->markdown('Email.welcomeToApp')->with([
            'user' => $this->user, 'userPassword'=>$this->userPassword
        ]);
    }
}
