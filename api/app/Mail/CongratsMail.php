<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class CongratsMail extends Mailable
{
    use Queueable, SerializesModels;

    public $conge;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($conge)
    {
        $this->conge = $conge;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->subject('Demande de congé')->markdown('Email.congrats')->with([
            'conge' => $this->conge
        ]);        
    }
}
