// tutorial.js
window.addEventListener('load', () => {
  // crea il pulsante
  const helpBtn = document.createElement('button');
  helpBtn.innerText = 'Hai bisogno di aiuto?';
  helpBtn.id = 'swagger-help-btn';
  helpBtn.style.position = 'fixed';
  helpBtn.style.top = '10px';
  helpBtn.style.right = '10px';
  helpBtn.style.zIndex = 9999;
  helpBtn.style.padding = '8px 12px';
  helpBtn.style.backgroundColor = '#007bff';
  helpBtn.style.color = 'white';
  helpBtn.style.border = 'none';
  helpBtn.style.borderRadius = '4px';
  helpBtn.style.cursor = 'pointer';

  document.body.appendChild(helpBtn);

  // crea il modal
  const modal = document.createElement('div');
  modal.id = 'swagger-help-modal';
  modal.innerHTML = `
    <div class="modal-content">
      <h2>Guida rapida BlueMobility API</h2>

      <h3>1. Accesso all’API</h3>
      <p>Tutte le chiamate alle API protette richiedono un <strong>token JWT</strong>.</p>
      <ol>
        <li>Effettua il login tramite l’endpoint <code>/api/v1/auth/login</code></li>
        <li>Inserisci username e password</li>
        <li>Riceverai un token JWT valido per le richieste successive</li>
        <li>In Swagger UI, clicca "Authorize" in alto a destra e inserisci il token;</code></li>
      </ol>

      <h3>2. Anteprima dei dati (Preview)</h3>
      <p>Per visualizzare rapidamente i dati senza scaricare tutto il dataset:</p>
      <ul>
        <li>Vai all’endpoint della tabella, ad esempio <code>/api/v1/ba_docume001/preview</code></li>
        <li>Parametri disponibili:
          <ul>
            <li><code>page</code>: numero della pagina (default = 1)</li>
            <li><code>limit</code>: righe per pagina (default = 100)</li>
          </ul>
        </li>
        <li>La risposta JSON contiene informazioni su pagina, limite, totale record e dati</li>
      </ul>

      <h3>3. Esportazione dei dati (Export)</h3>
      <p>Per scaricare dataset completi o filtrati per intervallo di date:</p>
      <ul>
        <li>Vai all’endpoint di export, ad esempio <code>/api/v1/ba_docume001/export</code></li>
        <li>Parametri disponibili:
          <ul>
            <li><code>startDate</code> (opzionale): filtro da data <code>YYYY-MM-DD</code></li>
            <li><code>endDate</code> (opzionale): filtro a data <code>YYYY-MM-DD</code></li>
          </ul>
        </li>
        <li>Esempio: <code>/api/v1/ba_docume001/export?startDate=2021-01-01&endDate=2021-01-05</code></li>
        <li>Il file restituito sarà un <strong>ZIP</strong> contenente il JSON formattato</li>
      </ul>

      <h3>4. Note e disclaimer</h3>
      <ul>
        <li>Alcune chiamate GET per export di dataset molto grandi possono richiedere diversi minuti, soprattutto quando le tabelle contengono milioni di record.</li>
        <li>Le route senza export indicano che i dati non sono sufficientemente voluminosi e possono essere visualizzate direttamente in Swagger.</li>
        <li>Gli export sono gestiti in streaming per ridurre l’impatto sulla memoria del server.</li>
      </ul>

      <h3>5. Consigli pratici</h3>
      <ul>
        <li>Usa sempre la preview prima di un export per evitare di scaricare grandi quantità di dati inutilmente.</li>
        <li>Applica filtri per intervallo di date o chiavi specifiche per ridurre il volume del file.</li>
        <li>Tutti gli export restituiscono JSON leggibile e formattato, facilmente importabile in editor o database.</li>
      </ul>

      <button id="close-help">Chiudi</button>
    </div>
  `;
  modal.style.display = 'none';
  modal.style.position = 'fixed';
  modal.style.top = '0';
  modal.style.left = '0';
  modal.style.width = '100%';
  modal.style.height = '100%';
  modal.style.backgroundColor = 'rgba(0,0,0,0.5)';
  modal.style.zIndex = 9998;
  modal.style.overflowY = 'auto';
  modal.style.padding = '20px';
  modal.style.boxSizing = 'border-box';

  document.body.appendChild(modal);

  // stile interno per il contenuto
  const modalContent = modal.querySelector('.modal-content');
  modalContent.style.backgroundColor = 'white';
  modalContent.style.padding = '20px';
  modalContent.style.borderRadius = '6px';
  modalContent.style.maxWidth = '800px';
  modalContent.style.margin = '40px auto';
  modalContent.style.boxShadow = '0 2px 10px rgba(0,0,0,0.3)';

  // click per aprire
  helpBtn.addEventListener('click', () => {
    modal.style.display = 'block';
  });

  // click per chiudere
  document.getElementById('close-help').addEventListener('click', () => {
    modal.style.display = 'none';
  });
});
