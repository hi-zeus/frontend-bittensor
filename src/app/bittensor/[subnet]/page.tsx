import { items } from "@/components/molecules/bittensor/item-date";
import BittensorSubnetPrompting from "@/components/organisms/bittensor-subnet/bittensor-subnet-prompting";
import BittensorSubnetTranslate from "@/components/organisms/bittensor-subnet/bittensor-subnet-translate";

const SubnetPage =  ({ params }: { params: { subnet: string } })  =>{

    const title = (params.subnet.charAt(0).toUpperCase() + params.subnet.slice(1)).replace('-', ' ');
    const subnet = items.filter((item, idx) => (item.name).toLowerCase().replace(" ", '-') == params.subnet)[0];


    
    const SubnetComponent = () => {
        
        let component = <BittensorSubnetPrompting/>;

        switch (params.subnet) {
            case 'subnet-1':
                
                component = <BittensorSubnetPrompting/>
                break;
            
            case 'subnet-2':
                
                component = <BittensorSubnetTranslate/>
                break;

            default:
                break;
        }

        return component;
    }

    if(!subnet) {
        return (
            <main className="mt-[30px] my-auto mx-auto xl:w-[1000px] px-[20px] py-[50px] h-[70vh] flex justify-center items-center">
                <h2 className="text-[32px] text-white text-center">
                    Not found!
                </h2>
            </main>
        )
    }

	return (
		<main className="mt-[30px] my-auto mx-auto xl:w-[1000px] px-[20px] py-[50px] w-full">
            <h2 className="text-[32px] font-bold text-center">
                {title}
            </h2>
            <p className="text-center text-[20px] text-white">
                {subnet.description}
            </p>
            <div className="mt-[60px]">
                {
                    SubnetComponent()
                }
            </div>
        </main>
    )
}

export default SubnetPage;