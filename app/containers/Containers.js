import Transaction from './transaction/Transaction';
import HomeScreen from './home/Home';
import FirstLaunchScreen from './launch/FirstLaunchScreen';
import ServiceAgreementScreen from './launch/ServiceAgreementScreen';
import BackupMnemonicScreen from './launch/BackupMnemonicScreen';
import BackupWalletScreen from './launch/BackupWalletScreen';
import CreateWalletScreen from './launch/CreateWalletScreen';
import ImportWalletScreen from './launch/ImportWalletScreen';
import VerifyMnemonicScreen from './launch/VerifyMnemonicScreen';
import MyScreen from './settings/MyScreen';
import SetScreen from './settings/SetScreen';
import ExportPrivateKeyScreen from './settings/ExportPrivateKeyScreen';
import ExportKeystoreScreen from './settings/ExportKeystoreScreen';
import ReceiptCodeScreen from './settings/ReceiptCodeScreen';
import ScanQRCodeScreen from './settings/ScanQRCodeScreen';
import TransactionDetail from './transaction/TransactionDetail';
import Loading from './appLoading/Loading';
import TransactionRecoder from './transaction/TransactionRecoder';
import CreateContactScreen from './settings/CreateContactScreen';
import ContactListScreen from './settings/ContactListScreen';
import ContactInfoScreen from './settings/ContactInfoScreen';
import AboutUsScreen from './settings/AboutUsScreen';
import FeedbackScreen from './settings/FeedbackScreen';
import ChoseLanguageScreen from './settings/ChoseLanguageScreen';
import ChoseMonetaryUnitScreen from './settings/ChoseMonetaryUnitScreen';
import SystemSetScreen from './settings/SystemSetScreen';
import UseAndPrivacyPolicyScreen from './settings/UseAndPrivacyPolicyScreen';
import AddAssets from './home/AddAssets';
import AddTokenScreen from './settings/AddTokenScreen';
import SearchTokenScreen from './settings/SearchTokenScreen';
import MessageCenterScreen from './settings/MessageCenterScreen';
import MessageWebViewScreen from './settings/MessageWebViewScreen';
import AddressListScreen from './settings/AddressListScreen';
import MappingTermsScreen from './mapping/MappingTermsScreen';
import ChangeBindAddressScreen from './mapping/ChangeBindAddressScreen';
import BindWalletAddressScreen from './mapping/BindWalletAddressScreen';
import ItcMappingServiceScreen from './mapping/ItcMappingServiceScreen';
import MappingRecordsScreen from './mapping/MappingRecordsScreen';
import MappingRecordDetailScreen from './mapping/MappingRecordDetailScreen';
import MappingGuideScreen from './mapping/MappingGuideScreen';
import WalletListScreen from './settings/WalletListScreen';
import ChoseWalletTypeScreen from './launch/ChoseWalletTypeScreen';
import Mapping from './mapping/Mapping';
import ExchangeScreen from './exchange/ExchangeScreen';
import ExchangeDetail from './exchange/ExchangeDetail';
import MappingServiceAgreement from './mapping/MappingServiceAgreementScreen';

import WLHome from './activity/WLHome/WLHome';
import WLTask from './activity/WLTask/WLTask';
import WLLock from './activity/WLLockVote/WLLock'; // 锁仓
import WLVote from './activity/WLLockVote/WLVote'; // 投票
import WLAuth from './activity/WLAuth/WLAuth'; // 合约授权
import WLNode from './activity/WLNode/WLNode'; // 选择节点
import NodeSummary from './activity/WLActive/NodeSummary'; // 活动首页-超级
import WLNodeActivate from './activity/WLNodeActivate/WLNodeActivate'; // 激活节点
import WLNodeInfo from './activity/WLNodeInfo/WLNodeInfo'; // 节点信息
import WLInvite from './activity/WLInvite/WLInvite';
import WLBenefit from './activity/WLBenefit/WLBenefit';
import WLPages from './activity/WLPages/WLPages'; // 路由浏览列表

import ChooseActivityETHWallet from './activity/ChooseActivityETHWallet'
import ChooseActivityITCWallet from './activity/ChooseActivityITCWallet'
import WebViewScreen from './activity/WebViewScreen'

export {
  HomeScreen,
  Transaction,
  FirstLaunchScreen,
  ServiceAgreementScreen,
  BackupMnemonicScreen,
  BackupWalletScreen,
  CreateWalletScreen,
  ImportWalletScreen,
  VerifyMnemonicScreen,
  MyScreen,
  SetScreen,
  ExportPrivateKeyScreen,
  ExportKeystoreScreen,
  // PasswordPrompInfoScreen,
  ReceiptCodeScreen,
  ScanQRCodeScreen,
  TransactionDetail,
  Loading,
  TransactionRecoder,
  CreateContactScreen,
  ContactListScreen,
  ContactInfoScreen,
  AboutUsScreen,
  FeedbackScreen,
  ChoseLanguageScreen,
  ChoseMonetaryUnitScreen,
  SystemSetScreen,
  UseAndPrivacyPolicyScreen,
  AddAssets,
  AddTokenScreen,
  SearchTokenScreen,
  MessageCenterScreen,
  MessageWebViewScreen,
  AddressListScreen,
  MappingTermsScreen,
  ChangeBindAddressScreen,
  BindWalletAddressScreen,
  ItcMappingServiceScreen,
  MappingRecordsScreen,
  MappingRecordDetailScreen,
  MappingGuideScreen,
  WalletListScreen,
  ChoseWalletTypeScreen,
  Mapping,
  ExchangeScreen,
  ExchangeDetail,
  WLHome,
  WLTask,
  WLLock,
  WLVote,
  WLAuth,
  WLNode,
  WLNodeActivate,
  WLNodeInfo,
  WLInvite,
  WLBenefit,
  WLPages,
  ChooseActivityETHWallet,
  ChooseActivityITCWallet,
  WebViewScreen,
  NodeSummary,
  MappingServiceAgreement,
};
