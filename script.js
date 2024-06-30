
base_url = "https://api.frankfurter.app"

const dropdowns = document.querySelectorAll(".dropdown select")
const btn = document.querySelector(".btn");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg")

window.addEventListener("load",()=>{
	upExData();
})

// for (code in countryList){
// 	console.log(code, countryList[code]);
// }

let i = 0

for (let select of dropdowns){
   for (code in countryList){
	let newOption = document.createElement("option")
	newOption.innerText = code;
	newOption.value =code;
	
	if(select.name === "from" && code==="USD"){
		newOption.selected = "selected";
	}else if (select.name === "To" && code==="INR"){
		newOption.selected = "selected";
	}
		
	select.append(newOption);
   }

   select.addEventListener("change", (evt)=>{
	updateFlag(evt.target)
   })
}

const updateFlag = (element)=>{
	let currCode =element.value
	let countryCode = countryList[currCode];
	let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
	let img = element.parentElement.querySelector("img");
	img.src = newSrc;

}

btn.addEventListener("click",async (evt)=>{
	evt.preventDefault();
	upExData();
	
})

const upExData = async ()=>  {
	let amt = document.querySelector(".amount input")
	let amtval =parseFloat(amt.value);

	
	if(amtval === "" || amtval<1 ){
		amtval =1;
		amt.value ="1";
	}

	
	const upUrl = `${base_url}/latest?from=${fromCurr.value.toLowerCase()}&to=${toCurr.value.toLowerCase()}`
	let response = await fetch(upUrl);
	let data = await response.json();
	let rate = data.rates[toCurr.value];
	let finalAmt = amtval *rate;

	let formattedFinalAmt = finalAmt.toLocaleString(`en-${countryList[toCurr.value]}`, {
		style: "currency",
		currency: toCurr.value,
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	});

	let formattedInitialAmt = amtval.toLocaleString(`en-${countryList[fromCurr.value]}`, {
		style: "currency",
		currency: fromCurr.value,
		minimumFractionDigits:0,
		maximumFractionDigits: 0,
	});

	msg.innerText = `${formattedInitialAmt} =  ${formattedFinalAmt}`

  
}



// Event listener for interchange 
const interchangeCurrencies = document.querySelector(".fa-right-left");
if (interchangeCurrencies) {
    interchangeCurrencies.addEventListener("click", () => {
        // Swap selected currencies
        const temp = fromCurr.value;
        fromCurr.value = toCurr.value;
        toCurr.value = temp;

        // Update flag images
        updateFlag(fromCurr);
        updateFlag(toCurr);

        // Update exchange rate data
        upExData();
    });
}
