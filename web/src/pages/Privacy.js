import { Component, html } from '../lib/vendor.js';

export class PrivacyPage extends Component {
  static path = "privacy";

  render() {
    return html`
      <div class="page privacy-page">
        <h1>Privacy & Algemene Voorwaarden</h1>  
        <section>
          <h2>Privacy</h2>
          <p>Wij respecteren uw privacy en gaan zorgvuldig om met uw persoonlijke gegevens. De gegevens die u invult worden alleen gebruikt voor het doel van deze petitie.</p>
          
          <h3>Welke gegevens verzamelen we?</h3>
          <ul>
            <li>Naam</li>
            <li>E-mailadres</li>
            <li>Telefoonnummer</li>
            <li>Postcode</li>
            <li>Browser fingerprint (anonieme identificatiecode)</li>
          </ul>

          <h3>Hoe gebruiken we deze gegevens?</h3>
          <p>Deze gegevens worden gebruikt om:</p>
          <ul>
            <li>De geldigheid van uw handtekening te verifiëren</li>
            <li>U op de hoogte te houden van de voortgang van de petitie</li>
            <li>De overheid te informeren over het aantal ondertekenaars</li>
          </ul>

          <h3>Gegevensopslag</h3>
          <p>Uw gegevens worden veilig opgeslagen en worden niet gedeeld met derden zonder uw toestemming. We gebruiken moderne beveiligingsmaatregelen om uw gegevens te beschermen.</p>
        </section>

        <section>
          <h2>Algemene Voorwaarden</h2>
          <p>Door het ondertekenen van deze petitie gaat u akkoord met de volgende voorwaarden:</p>
          
          <h3>1. Doel van de Petitie</h3>
          <p>Deze petitie is bedoeld om de overheid te informeren over het draagvlak voor het onderwerp en om actie te stimuleren.</p>

          <h3>2. Gebruik van Gegevens</h3>
          <p>Uw gegevens worden alleen gebruikt voor het doel van deze petitie en worden niet voor andere doeleinden gebruikt.</p>

          <h3>3. Intellectueel Eigendom</h3>
          <p>Alle rechten op de inhoud van deze website berusten bij de initiatiefnemers van de petitie.</p>

          <h3>4. Aansprakelijkheid</h3>
          <p>De initiatiefnemers zijn niet aansprakelijk voor eventuele schade die zou kunnen ontstaan door het gebruik van deze website of de petitie.</p>
        </section>

        <section>
          <h2>Contact</h2>
          <p>Heeft u vragen over onze privacy policy of algemene voorwaarden? Neem dan contact met ons op via het contactformulier.</p>
        </section>
        <a href="/" class="back-button" data-navigo>← Terug naar home</a>
      </div>
    `;
  }
} 