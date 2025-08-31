import EnumNode from '../../enums/EnumNodes';
import LayoutManager from '../../layout/LayoutManager';
import NodeGroupModel from '../../scene/NodeGroupModel';
import NodeModel from '../../scene/NodeModel';
import SceneModel from '../../scene/SceneModel';

export default class FactoryScene {
	static get(): SceneModel {
		// const nodeBigBoss = new NodeModel(EnumNode.bigBoss, 'Big Boss');
		const nodeBurgerCook1 = new NodeModel(EnumNode.burgerCook1, 'Burger Cook #1');
		const nodeBurgerCook2 = new NodeModel(EnumNode.burgerCook2, 'Burger Cook #2');
		const nodeCashier1 = new NodeModel(EnumNode.cashier1, 'Cashier #1');
		const nodeCashier2 = new NodeModel(EnumNode.cashier2, 'Cashier #2');
		const nodeCashier3 = new NodeModel(EnumNode.cashier3, 'Cashier #3');
		const nodeCustomer1 = new NodeModel(EnumNode.customer1, 'Customer #1');
		const nodeCustomer2 = new NodeModel(EnumNode.customer2, 'Customer #2');
		const nodeCustomer3 = new NodeModel(EnumNode.customer3, 'Customer #3');
		const nodeCustomer4 = new NodeModel(EnumNode.customer4, 'Customer #4');
		const nodeCustomer5 = new NodeModel(EnumNode.customer5, 'Customer #5');
		const nodeCustomer6 = new NodeModel(EnumNode.customer6, 'Customer #6');
		const nodeDrinksMaker1 = new NodeModel(EnumNode.drinksMaker1, 'Drinks Maker #1');
		const nodeDrinksMaker2 = new NodeModel(EnumNode.drinksMaker2, 'Drinks Maker #2');
		const nodeFriesCook1 = new NodeModel(EnumNode.friesCook1, 'fries Cook #1');
		const nodeFriesCook2 = new NodeModel(EnumNode.friesCook2, 'fries Cook #2');
		const nodeHeadChef = new NodeModel(EnumNode.headChef, 'headChef');
		// const nodeHumanResources = new NodeModel(EnumNode.HumanResources, 'Human Resources');
		const nodeServer1 = new NodeModel(EnumNode.server1, 'Server #1');

		const groupCustomerQueue = new NodeGroupModel('Customer Queue').setColumn(1).add(nodeCustomer1).add(nodeCustomer2).add(nodeCustomer3).add(nodeCustomer4).add(nodeCustomer5).add(nodeCustomer6);

		const groupCashiers = new NodeGroupModel('Cashiers').setColumn(2).add(nodeCashier1).add(nodeCashier2).add(nodeCashier3);
		const groupServers = new NodeGroupModel('Server').setColumn(2).add(nodeServer1);
		const groupKitchenOffice = new NodeGroupModel('Kitchen Office').setColumn(3).add(nodeHeadChef);
		const groupKitchen = new NodeGroupModel('Kitchen').setColumn(4).add(nodeBurgerCook1).add(nodeBurgerCook2).add(nodeFriesCook1).add(nodeFriesCook2).add(nodeDrinksMaker1).add(nodeDrinksMaker2);

		const scene = new SceneModel();

		// const groupHumanResources = new NodeGroupModel('Human Resources').add(nodeHumanResources);
		// const groupHeadOffice = new NodeGroupModel('Head Office').add(nodeBigBoss);

		//const scene = new SceneModel()
		// .addNodeGroup(groupHumanResources)
		// .addNodeGroup(groupHeadOffice);

		scene.addConnection(nodeCustomer1, nodeCashier1).addConnection(nodeCustomer1, nodeCashier2).addConnection(nodeCustomer1, nodeCashier3);
		scene.addConnection(nodeCustomer2, nodeCashier1).addConnection(nodeCustomer2, nodeCashier2).addConnection(nodeCustomer2, nodeCashier3);
		scene.addConnection(nodeCustomer3, nodeCashier1).addConnection(nodeCustomer3, nodeCashier2).addConnection(nodeCustomer3, nodeCashier3);
		scene.addConnection(nodeCustomer4, nodeCashier1).addConnection(nodeCustomer4, nodeCashier2).addConnection(nodeCustomer4, nodeCashier3);
		scene.addConnection(nodeCustomer5, nodeCashier1).addConnection(nodeCustomer5, nodeCashier2).addConnection(nodeCustomer5, nodeCashier3);
		scene.addConnection(nodeCustomer6, nodeCashier1).addConnection(nodeCustomer6, nodeCashier2).addConnection(nodeCustomer6, nodeCashier3);

		scene
			.addConnection(nodeServer1, nodeCustomer1)
			.addConnection(nodeServer1, nodeCustomer2)
			.addConnection(nodeServer1, nodeCustomer3)
			.addConnection(nodeServer1, nodeCustomer4)
			.addConnection(nodeServer1, nodeCustomer5)
			.addConnection(nodeServer1, nodeCustomer6);

		scene.addConnection(nodeCashier1, nodeHeadChef).addConnection(nodeCashier2, nodeHeadChef).addConnection(nodeCashier3, nodeHeadChef);

		scene
			.addConnection(nodeHeadChef, nodeBurgerCook1)
			.addConnection(nodeHeadChef, nodeBurgerCook2)
			.addConnection(nodeHeadChef, nodeFriesCook1)
			.addConnection(nodeHeadChef, nodeFriesCook2)
			.addConnection(nodeHeadChef, nodeDrinksMaker1)
			.addConnection(nodeHeadChef, nodeDrinksMaker2);

		scene.addConnection(nodeHeadChef, nodeServer1);

		scene
			.addConnection(nodeBurgerCook1, nodeHeadChef)
			.addConnection(nodeBurgerCook2, nodeHeadChef)
			.addConnection(nodeFriesCook1, nodeHeadChef)
			.addConnection(nodeFriesCook2, nodeHeadChef)
			.addConnection(nodeDrinksMaker1, nodeHeadChef)
			.addConnection(nodeDrinksMaker2, nodeHeadChef);

		scene.addNodeGroup(groupCustomerQueue).addNodeGroup(groupCashiers).addNodeGroup(groupServers).addNodeGroup(groupKitchenOffice).addNodeGroup(groupKitchen);

		LayoutManager.layout(scene);

		// scene.toDebugConsole();

		return scene;
	}
}
