import { firestore } from '../firebase';

enum AssetType {
  SINGLE,
  MULTI,
}

interface IAsset {
  protocol: string;
  protocolIcon: string;
  stakeType: AssetType; // 단일, 다중 스테이킹 여부
  stakeAsset: string;
  stakeAssetIcon: string;
  rewardType: AssetType; // 단일, 다중 리워드 여부
  rewardAsset: string;
  rewardAssetIcon: string;
  liquidity: string;
  apr: string;
}

const getAssets = async () => {
  firestore
    .collection('assets')
    .get()
    .then((docs) => {
      docs.forEach((doc) => {
        console.log(doc.data());
      });
    });
};

const addAsset = async (asset: IAsset) => {
  firestore
    .collection('assets')
    .add({ ...asset })
    .then((res) => {
      console.log(res);
    });
};

(async () => {
  const assetList = [
    {
      protocol: 'pancakeSwap',
      protocolIcon: 'www.google.com',
      stakeType: AssetType.MULTI,
      stakeAsset: 'BTC+ETH',
      stakeAssetIcon: 'www.naver.com',
      rewardType: AssetType.SINGLE,
      rewardAsset: 'CAKE',
      rewardAssetIcon: 'www.daum.net',
      liquidity: '$ 10,000,000',
      apr: '74.56%',
    },
  ];
  await addAsset(assetList[0]);
})();
