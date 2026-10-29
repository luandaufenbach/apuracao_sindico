window.APP_DATA = {
  apps: [
    { id: 1, name: 'Harbor Lend', cat: 'Lending', tvl: 412.8, change: 4.2, users: 182400 },
    { id: 2, name: 'Driftline', cat: 'Exchange', tvl: 318.2, change: 2.1, users: 241900 },
    { id: 3, name: 'Keel Vaults', cat: 'Yield', tvl: 196.4, change: -1.8, users: 40210 },
    { id: 4, name: 'Pier Pay', cat: 'Payments', tvl: 88.0, change: 12.5, users: 510330 },
    { id: 5, name: 'Mast Oracle', cat: 'Infra', tvl: 54.7, change: 0.6, users: 9120 },
  ],
  txs: [
    { id: 'a1', hash: '0x8f2c…91ad', type: 'Transfer', amount: 1250, asset: 'USDC', status: 'Confirmed', time: '2 min ago', fee: '0.0021', to: '0x41be…77c0', block: 48201993 },
    { id: 'a2', hash: '0x1b7e…02f4', type: 'Swap', amount: 3400, asset: 'LMN', status: 'Confirmed', time: '18 min ago', fee: '0.0034', to: 'Driftline', block: 48201870 },
    { id: 'a3', hash: '0x6d90…ac13', type: 'Stake', amount: 10000, asset: 'LMN', status: 'Pending', time: '1 h ago', fee: '0.0018', to: 'Validator 12', block: 48201511 },
    { id: 'a4', hash: '0x3e55…b7d2', type: 'Transfer', amount: 80, asset: 'USDC', status: 'Failed', time: '3 h ago', fee: '0.0009', to: '0x9a03…1e6b', block: 48200774 },
    { id: 'a5', hash: '0xc4a1…5f08', type: 'Swap', amount: 640, asset: 'USDC', status: 'Confirmed', time: 'Yesterday', fee: '0.0027', to: 'Driftline', block: 48190221 },
    { id: 'a6', hash: '0x77bd…e391', type: 'Stake', amount: 2500, asset: 'LMN', status: 'Confirmed', time: '2 days ago', fee: '0.0016', to: 'Validator 04', block: 48171008 },
  ],
  assets: [
    { id: 'lmn', sym: 'LMN', name: 'Lumen', bal: 18240.5, price: 1.84, color: 'var(--blue-500)' },
    { id: 'usdc', sym: 'USDC', name: 'USD Coin', bal: 9310.0, price: 1, color: 'var(--blue-200)' },
    { id: 'weth', sym: 'WETH', name: 'Wrapped Ether', bal: 1.42, price: 3120, color: 'var(--gray-400)' },
    { id: 'hbr', sym: 'HBR', name: 'Harbor', bal: 5200, price: 0.31, color: 'var(--blue-800)' },
  ],
  volume: Array.from({ length: 30 }, (_, i) => ({ label: 'Day ' + (i + 1), value: Math.round(22 + Math.pow(Math.sin(i / 5), 2) * 18 + (i > 18 && i < 24 ? (i - 18) * 6 : 0) + (i % 3) * 2) })),
};
window.fmtUsd = (v, d = 0) => '$' + Number(v).toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });
