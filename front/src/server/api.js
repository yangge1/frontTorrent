import fetch from './index'
export const getTorrents = (data)=>fetch('/api/torrent/getList',data);
export const getTorrentDetail = (data)=>fetch('/api/torrent/getDetail',data);

export const getCount = (data)=>fetch('/api/torrent/listCount',data);
export const addTorrents = (data)=>fetch('/api/torrent/addList',data,'POST');
export const addTorrentDetail = (data)=>fetch('/api/torrent/addDetail',data,'POST');
export const overWriteBrowser = (data)=>fetch('/api/browser/overwrite',data,'POST');
