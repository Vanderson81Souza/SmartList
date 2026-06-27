// --- CONFIGURAÇÃO DO CACHE PROFISSIONAL ---
// Centraliza o nome da versão e a lista completa de arquivos que rodam offline
const CACHE_NAME = 'smartlist-v4-cache';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-512.png'
];

// 1. EVENTO DE INSTALAÇÃO: Salva todos os arquivos mapeados acima no cache do celular
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Baixa e guarda as páginas e o ícone localmente na memória do smartphone
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting(); // Força o app a rodar a versão nova imediatamente sem travar
});

// 2. EVENTO DE ATIVAÇÃO: Limpa os caches antigos de versões anteriores para poupar espaço
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// 3. EVENTO DE BUSCA (FETCH): Intercepta as requisições e carrega do cache se estiver sem sinal
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Se o arquivo estiver guardado no cache, usa ele (instantâneo). Se não, busca na internet.
      return cachedResponse || fetch(event.request);
    })
  );
});
