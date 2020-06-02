/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {

  //  ╦ ╦╔═╗╔╗ ╔═╗╔═╗╔═╗╔═╗╔═╗
  //  ║║║║╣ ╠╩╗╠═╝╠═╣║ ╦║╣ ╚═╗
  //  ╚╩╝╚═╝╚═╝╩  ╩ ╩╚═╝╚═╝╚═╝
  // …


  //  ╔═╗╔═╗╦  ╔═╗╔╗╔╔╦╗╔═╗╔═╗╦╔╗╔╔╦╗╔═╗
  //  ╠═╣╠═╝║  ║╣ ║║║ ║║╠═╝║ ║║║║║ ║ ╚═╗
  //  ╩ ╩╩  ╩  ╚═╝╝╚╝═╩╝╩  ╚═╝╩╝╚╝ ╩ ╚═╝
  // Note that, in this app, these API endpoints may be accessed using the `Cloud.*()` methods
  // from the Parasails library, or by using those method names as the `action` in <ajax-form>.

  'POST /api/auth/register': 'UserController.signup',
  'POST /api/auth/login': 'UserController.login',
  'GET /api/auth/protected': 'UserController.check',
  'POST /test': 'UserController.test',

  'POST /api/ipfsnode/startnode': 'IpfsnodeController.startnode',
  'POST /api/ipfsnode/stopnode': 'IpfsnodeController.stopnode',
  'POST /api/ipfsnode/getipfsconfig': 'IpfsnodeController.getipfsconfig',
  'POST /api/ipfsnode/getnodestatus': 'IpfsnodeController.getnodestatus',

  'POST /api/ipfsusage/getusage': 'IpfsusageController.getusage',
  'POST /api/ipfsusage/listfiles': 'IpfsusageController.listfiles',
  'POST /api/ipfsusage/savefile': 'IpfsusageController.savefile',
  'POST /api/ipfsusage/createbasepath': 'IpfsusageController.createbasepath',
  'POST /api/ipfsusage/listbasepaths': 'IpfsusageController.listbasepaths',
  'POST /api/ipfsusage/checkbasepaths': 'IpfsusageController.checkbasepaths',
  'POST /api/ipfsusage/deletefile': 'IpfsusageController.deletefile',
  'POST /api/ipfsusage/searchfiles': 'IpfsusageController.searchfiles',

  'POST /api/usergroup/geta1configuser': 'UsergroupController.geta1configuser',
  'POST /api/usergroup/geta2configuser': 'UsergroupController.geta2configuser',
  'POST /api/usergroup/getc1configuser': 'UsergroupController.getc1configuser',
  'POST /api/usergroup/createa1configuser': 'UsergroupController.createa1configuser',
  'POST /api/usergroup/createa2configuser': 'UsergroupController.createa2configuser',
  'POST /api/usergroup/createc1configuser': 'UsergroupController.createc1configuser',
  'POST /api/usergroup/getb1nodesuser': 'UsergroupController.getb1nodesuser',
  'POST /api/usergroup/joinb1nodesuser': 'UsergroupController.joinb1nodesuser',
  'POST /api/usergroup/joina1groupuser': 'UsergroupController.joina1groupuser',
  'POST /api/usergroup/createa1groupuser': 'UsergroupController.createa1groupuser',
  'POST /api/usergroup/joina2groupuser': 'UsergroupController.joina2groupuser',
  'POST /api/usergroup/createa2groupuser': 'UsergroupController.createa2groupuser',

  'POST /api/usergroup/lista1groups': 'UsergroupController.lista1groups',
  'POST /api/usergroup/lista2groups': 'UsergroupController.lista2groups',
  'POST /api/usergroup/listc1groups': 'UsergroupController.listc1groups',


  'POST /api/ipfsadmin/listusers': 'IpfsadminController.listusers',
  'POST /api/ipfsadmin/createuserconfig': 'IpfsadminController.createuserconfig',
  'POST /api/ipfsadmin/updateuserconfig': 'IpfsadminController.updateuserconfig',
  'POST /api/ipfsadmin/expandusagelimit': 'IpfsadminController.expandusagelimit',
  'POST /api/ipfsadmin/getuserconfig': 'IpfsadminController.getuserconfig',
  'POST /api/ipfsadmin/enableuser': 'IpfsadminController.enableuser',
  'POST /api/ipfsadmin/disableuser': 'IpfsadminController.disableuser',
  'POST /api/ipfsadmin/assignnodetouser': 'IpfsadminController.assignnodetouser',
  'POST /api/ipfsadmin/updatenodeusage': 'IpfsadminController.updatenodeusage',

  'POST /api/tokenuser/gettokenbalance': 'TokenuserController.gettokenbalance',
  'POST /api/tokenuser/updateearnedtoken': 'TokenuserController.updateearnedtoken',
  'POST /api/tokenuser/sendtoken': 'TokenuserController.sendtoken',
  'POST /api/tokenuser/tokentoadd': 'TokenuserController.tokentoadd',
  'POST /api/tokenuser/redeemtoken': 'TokenuserController.redeemtoken',
  'POST /api/tokenuser/createuserwallet': 'TokenuserController.createuserwallet',
  'POST /api/nodeoperation/joinnodeprivate': 'IpfsproviderController.joinnodeprivate',
  'POST /api/nodeoperation/joinnodepublic': 'IpfsproviderController.joinnodepublic',
  'POST /api/nodeoperation/joinnodecluster': 'IpfsproviderController.joinnodecluster',
  'POST /api/nodeoperation/listclusternodes': 'IpfsproviderController.getclusternodes',
  'POST /api/nodeoperation/listprivatenodes': 'IpfsproviderController.getprivatenodes',
  'POST /api/nodeoperation/listpublicnodes': 'IpfsproviderController.getpublicnodes',
  'POST /api/nodeoperation/deletenodeid': 'IpfsproviderController.deletenodeid',
  'POST /api/nodeoperation/getnodedata': 'IpfsproviderController.getnodedata',

  'POST /api/nodeoperation/getprivategroups': 'IpfsproviderController.getprivategroups',
  'POST /api/nodeoperation/getpublicgroups': 'IpfsproviderController.getpublicgroups',

  'POST /api/nodeoperation/listnodesofgroup': 'IpfsproviderController.listnodesofgroup',


};
