import React, { useState } from 'react';
import { Store, Image as ImageIcon, Check, Lock } from 'lucide-react';

export function LojaSidebar({ collection, onUpdateCollection }: any) {
  const [activeTab, setActiveTab] = useState('geral');

  return (
    <div className="space-y-6">
      <div className="border border-gray-200 rounded-xl p-4 shadow-sm bg-[#F8FAFC]">
        <div className="flex justify-between items-start">
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-[#E0F2FE] flex items-center justify-center text-[#0284C7] shrink-0 mt-0.5">
              <Store className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-bold text-gray-900">Venda de Fotos</div>
              <p className="text-xs text-gray-500 max-w-[150px]">Permita que clientes comprem suas fotos.</p>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <div 
              onClick={() => {
                const newStoreEnabled = !collection.storeEnabled;
                onUpdateCollection(collection.id, { 
                  storeEnabled: newStoreEnabled,
                  allowDownload: newStoreEnabled ? false : collection.allowDownload
                });
              }}
              className={`w-11 h-6 rounded-full flex items-center px-0.5 cursor-pointer transition-colors ${collection.storeEnabled ? 'bg-emerald-500' : 'bg-gray-200'}`}
            >
              <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${collection.storeEnabled ? 'translate-x-5' : 'translate-x-0'}`}></div>
            </div>
            <span className={`text-[10px] mt-1 font-bold ${collection.storeEnabled ? 'text-emerald-600' : 'text-gray-400'}`}>
              {collection.storeEnabled ? 'LOJA ATIVA' : 'INATIVA'}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-1 border-b border-gray-200 pb-2">
        <button onClick={() => setActiveTab('geral')} className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-colors ${activeTab === 'geral' ? 'bg-[#D05634] text-white' : 'text-gray-600 hover:bg-gray-100'}`}>Geral</button>
        <button onClick={() => setActiveTab('marca')} className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-colors ${activeTab === 'marca' ? 'bg-[#D05634] text-white' : 'text-gray-600 hover:bg-gray-100'}`}>Marca D'água</button>
        <button onClick={() => setActiveTab('escolhas')} className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-colors ${activeTab === 'escolhas' ? 'bg-[#D05634] text-white' : 'text-gray-600 hover:bg-gray-100'}`}>Escolhas</button>
        <button onClick={() => setActiveTab('historico')} className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-colors ${activeTab === 'historico' ? 'bg-[#D05634] text-white' : 'text-gray-600 hover:bg-gray-100'}`}>Histórico</button>
        <button onClick={() => setActiveTab('config')} className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-colors ${activeTab === 'config' ? 'bg-[#D05634] text-white' : 'text-gray-600 hover:bg-gray-100'}`}>Configurações</button>
      </div>

      {activeTab === 'escolhas' && (
        <div className="space-y-4">
          <div className="border border-gray-200 rounded-xl p-4 bg-white shadow-sm">
            <h4 className="text-sm font-semibold text-gray-900 mb-1">Escolhas dos Clientes</h4>
            <p className="text-[10px] text-gray-500 mb-4 leading-tight">Visualize as fotos selecionadas por cada cliente logado.</p>
            
            <div className="space-y-3">
              {/* This will be populated from Firestore in a real scenario, for now we show a placeholder or a list if collections has it */}
              {collection.clientSelections && Object.keys(collection.clientSelections).length > 0 ? (
                Object.entries(collection.clientSelections).map(([email, data]: [string, any]) => (
                  <div key={email} className="p-3 border border-gray-100 rounded-lg bg-gray-50/50">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold text-gray-800">{data.email || email.replace(/_/g, '.')}</span>
                      <div className="flex gap-1">
                        <span className="text-[9px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-bold">
                          {data.selection?.length || 0} sel.
                        </span>
                        <span className="text-[9px] bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full font-bold">
                          {data.downloadedIndices?.length || 0} baix.
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-5 gap-1">
                      {data.selection?.slice(0, 10).map((idx: number) => (
                        <div key={idx} className="aspect-square bg-gray-200 rounded overflow-hidden">
                          <img src={collection.media[idx]} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </div>
                      ))}
                      {data.selection?.length > 10 && (
                        <div className="aspect-square bg-gray-100 rounded flex items-center justify-center text-[10px] text-gray-400 font-bold">
                          +{data.selection.length - 10}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <ImageIcon className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                  <p className="text-xs text-gray-400">Nenhuma escolha registrada ainda.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'geral' && (
        <div className="space-y-6">
          <div className="border border-gray-200 rounded-xl p-4 bg-white shadow-sm">
            <h4 className="text-sm font-semibold text-gray-900 mb-1">Preços e Limites</h4>
            <p className="text-xs text-gray-500 mb-4">Defina a quantidade de fotos gratuitas e o valor adicional.</p>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Fotos Gratuitas</label>
                <input 
                  type="number" 
                  min="0"
                  value={collection.freePhotos || 0}
                  onChange={(e) => onUpdateCollection(collection.id, { freePhotos: Number(e.target.value) })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D05634]/50 focus:border-[#D05634]"
                />
                <p className="text-[10px] text-gray-400 mt-2 leading-tight">O cliente não pagará por fotos selecionadas até este limite.</p>
              </div>
              
              <div className="bg-[#FFF0EB] rounded-lg p-3 border border-[#D05634]/20">
                <label className="block text-xs font-semibold text-[#D05634] mb-1">Preço por Foto (R$)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">R$</span>
                  <input 
                    type="number"
                    step="0.01"
                    min="0"
                    value={collection.photoPrice || 0}
                    onChange={(e) => onUpdateCollection(collection.id, { photoPrice: Number(e.target.value) })}
                    className="w-full border border-white rounded-lg pl-8 pr-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#D05634]/50 focus:border-[#D05634]"
                  />
                </div>
              </div>
            </div>
            <button className="mt-4 w-full bg-[#D05634] text-white py-2 rounded-lg text-xs font-semibold hover:bg-[#b84a2b] transition-colors">
              Salvar Preços
            </button>
          </div>
        </div>
      )}

      {activeTab === 'marca' && (
        <div className="border border-gray-200 rounded-xl p-4 bg-white shadow-sm space-y-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-1">Marca D'água</h4>
          <p className="text-[10px] text-gray-500 mb-4 leading-tight">Proteja suas fotos com texto ou logotipo customizado.</p>
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">Tipo de Marca D'água</label>
              <div className="flex rounded-lg overflow-hidden border border-gray-200 p-1">
                <button
                  className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${(!collection.watermarkType || collection.watermarkType === 'text') ? 'bg-[#FFF0EB] text-[#D05634]' : 'text-gray-500 hover:bg-gray-50'}`}
                  onClick={() => onUpdateCollection(collection.id, { watermarkType: 'text' })}
                >
                  Texto
                </button>
                <button
                  className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${collection.watermarkType === 'image' ? 'bg-[#FFF0EB] text-[#D05634]' : 'text-gray-500 hover:bg-gray-50'}`}
                  onClick={() => onUpdateCollection(collection.id, { watermarkType: 'image' })}
                >
                  Imagem/Logo
                </button>
              </div>
            </div>

            {(!collection.watermarkType || collection.watermarkType === 'text') ? (
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Texto da Marca</label>
                <input 
                  type="text" 
                  value={collection.watermarkText || 'Cópia não autorizada'}
                  onChange={(e) => onUpdateCollection(collection.id, { watermarkText: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D05634]/50 focus:border-[#D05634]"
                />
              </div>
            ) : (
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">URL da Imagem</label>
                <input 
                  type="text" 
                  value={collection.watermarkImage || ''}
                  onChange={(e) => onUpdateCollection(collection.id, { watermarkImage: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D05634]/50 focus:border-[#D05634]"
                  placeholder="https://..."
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Opacidade ({collection.watermarkOpacity || 50}%)</label>
              <input 
                type="range" 
                min="0" max="100" 
                value={collection.watermarkOpacity || 50}
                onChange={(e) => onUpdateCollection(collection.id, { watermarkOpacity: Number(e.target.value) })}
                className="w-full accent-[#D05634] h-1.5 bg-gray-200 rounded-lg appearance-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">Posição</label>
              <div className="grid grid-cols-3 gap-2 w-32 mx-auto">
                {['top-left', 'top-center', 'top-right', 'center-left', 'center', 'center-right', 'bottom-left', 'bottom-center', 'bottom-right'].map(pos => (
                  <div 
                    key={pos}
                    onClick={() => onUpdateCollection(collection.id, { watermarkPosition: pos })}
                    className={`w-10 h-8 border rounded flex flex-col justify-center items-center cursor-pointer transition-colors ${
                      (collection.watermarkPosition || 'center') === pos ? 'bg-[#FFF0EB] border-[#D05634]' : 'bg-white border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className={`w-2 h-2 rounded-full ${
                      (collection.watermarkPosition || 'center') === pos ? 'bg-[#D05634]' : 'bg-gray-300'
                    }`} />
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-gray-50 border border-gray-100 rounded-lg p-3 text-center">
              <span className="text-[10px] text-gray-500">A marca d'água será aplicada exatamente como exibido na galeria pública quando a loja estiver ativa.</span>
            </div>
            
          </div>
        </div>
      )}

      {activeTab === 'historico' && (
        <div className="border border-gray-200 rounded-xl p-4 bg-white shadow-sm space-y-4">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-sm font-semibold text-gray-900">Histórico de Vendas</h4>
            <button className="text-[10px] bg-gray-100 hover:bg-gray-200 text-gray-600 px-2 py-1 rounded font-medium transition-colors">Atualizar</button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-gray-500 border-b border-gray-100">
                <tr>
                  <th className="font-medium pb-2 pr-2">Data</th>
                  <th className="font-medium pb-2 pr-2">Cliente</th>
                  <th className="font-medium pb-2 pr-2 leading-none">Valor</th>
                  <th className="font-medium pb-2">Método</th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                <tr className="border-b border-gray-50 last:border-0">
                  <td className="py-2 pr-2 text-[10px]">14 abr 2026</td>
                  <td className="py-2 pr-2 text-[10px]">
                    <div className="font-semibold">Guest</div>
                    <div className="text-gray-400">guest@ex...</div>
                  </td>
                  <td className="py-2 pr-2 font-semibold text-[#D05634]">R$ 60.00</td>
                  <td className="py-2 text-[10px]">PIX</td>
                </tr>
                <tr className="border-b border-gray-50 last:border-0">
                  <td className="py-2 pr-2 text-[10px]">13 abr 2026</td>
                  <td className="py-2 pr-2 text-[10px]">
                    <div className="font-semibold">Guest</div>
                    <div className="text-gray-400">guest@ex...</div>
                  </td>
                  <td className="py-2 pr-2 font-semibold text-[#D05634]">R$ 30.00</td>
                  <td className="py-2 text-[10px]">PIX</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'config' && (
        <div className="border border-gray-200 rounded-xl p-4 bg-white shadow-sm space-y-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-1">Gateways de Pagamento</h4>
          <p className="text-[10px] text-gray-500 mb-4 leading-tight">Configure provedores de PIX e Cartão de Crédito.</p>

          <div className="space-y-4">
            <div className="border border-[#D05634]/10 rounded-lg p-3 bg-white">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded bg-[#FFF0EB] text-[#D05634]">
                    <Lock className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-900">Acesso à Loja (Obrigatório)</div>
                    <div className="text-[10px] text-gray-500">Exigir identificação para entrar na loja</div>
                  </div>
                </div>
                {/* Always enabled if store is active based on request */}
                <div className="text-[10px] font-bold text-emerald-500">OBRIGATÓRIO</div>
              </div>
              <div className="space-y-3 mt-3">
                <div>
                  <label className="text-[10px] text-gray-500 block mb-1">Identificação (Login)</label>
                  <input 
                    type="text" 
                    value={collection.storeLogin || ''}
                    onChange={(e) => onUpdateCollection(collection.id, { storeLogin: e.target.value })}
                    placeholder="Ex: cliente01" 
                    className="w-full text-xs p-1.5 border border-gray-200 rounded bg-white focus:outline-none focus:ring-1 focus:ring-[#D05634]" 
                  />
                </div>
                <div>
                  <label className="text-[10px] text-gray-500 block mb-1">Senha de Acesso</label>
                  <input 
                    type="text" 
                    value={collection.storePassword || ''}
                    onChange={(e) => onUpdateCollection(collection.id, { storePassword: e.target.value })}
                    placeholder="Defina uma senha" 
                    className="w-full text-xs p-1.5 border border-gray-200 rounded bg-white focus:outline-none focus:ring-1 focus:ring-[#D05634]" 
                  />
                </div>
              </div>
            </div>

            <div className="border border-emerald-100 rounded-lg p-3 bg-emerald-50/30">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded bg-[#E8F5E9] text-[#2E7D32]">
                    <Check className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-900">Pagamento via PIX</div>
                    <div className="text-[10px] text-gray-500">Recebimentos instantâneos</div>
                  </div>
                </div>
                <div 
                  onClick={() => onUpdateCollection(collection.id, { pixEnabled: !collection.pixEnabled })}
                  className={`w-8 h-4 flex items-center bg-gray-200 rounded-full p-0.5 cursor-pointer ${collection.pixEnabled ? 'bg-emerald-500' : 'bg-gray-300'}`}
                >
                  <div className={`bg-white w-3 h-3 rounded-full shadow-md transform transition-transform ${collection.pixEnabled ? 'translate-x-4' : ''}`}></div>
                </div>
              </div>
              {collection.pixEnabled && (
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div>
                    <label className="text-[10px] text-gray-500 block mb-1">Provedor</label>
                    <select className="w-full text-xs p-1.5 border border-gray-200 rounded bg-white">
                      <option>Mercado Pago</option>
                      <option>PagHiper</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-500 block mb-1">Chave API / Token</label>
                    <input type="password" placeholder="Insira sua chave" className="w-full text-xs p-1.5 border border-gray-200 rounded bg-white" />
                  </div>
                </div>
              )}
            </div>

            <div className="border border-blue-100 rounded-lg p-3 bg-blue-50/30">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded bg-[#E3F2FD] text-[#1565C0]">
                    <Store className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-900">Cartão de Crédito</div>
                    <div className="text-[10px] text-gray-500">Pagamentos parcelados e à vista</div>
                  </div>
                </div>
                <div 
                  onClick={() => onUpdateCollection(collection.id, { cardEnabled: !collection.cardEnabled })}
                  className={`w-8 h-4 flex items-center bg-gray-200 rounded-full p-0.5 cursor-pointer ${collection.cardEnabled ? 'bg-blue-500' : 'bg-gray-300'}`}
                >
                  <div className={`bg-white w-3 h-3 rounded-full shadow-md transform transition-transform ${collection.cardEnabled ? 'translate-x-4' : ''}`}></div>
                </div>
              </div>
              {collection.cardEnabled && (
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div>
                    <label className="text-[10px] text-gray-500 block mb-1">Provedor</label>
                    <select className="w-full text-xs p-1.5 border border-gray-200 rounded bg-white">
                      <option>Stripe</option>
                      <option>Pagar.me</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div>
                      <label className="text-[10px] text-gray-500 block mb-1">Chave Pública</label>
                      <input type="password" placeholder="pk_live_..." className="w-full text-xs p-1.5 border border-gray-200 rounded bg-white" />
                    </div>
                    <div>
                      <label className="text-[10px] text-gray-500 block mb-1">Chave Secreta</label>
                      <input type="password" placeholder="sk_live_..." className="w-full text-xs p-1.5 border border-gray-200 rounded bg-white" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button className="w-full bg-[#D05634] text-white py-2 rounded-lg text-xs font-semibold hover:bg-[#b84a2b] transition-colors mt-2">
              Salvar Todas as Configurações
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
