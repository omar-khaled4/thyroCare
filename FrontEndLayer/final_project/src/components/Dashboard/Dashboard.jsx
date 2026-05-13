import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import style from "./Dashboard.module.css"
import { UserContext } from './../../context/UserContext';
import Chart from "react-apexcharts";
import html2pdf from "html2pdf.js";


export default function Dashboard(){

    let { userToken , setuserToken , user , setuser } = useContext(UserContext)



    

    //=============== circle Chart ===============//

    const value = 82;
    const size = 180;
    const strokeWidth = 14;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (value / 100) * circumference;

    //=============== circle Chart ===============//

    //=============== T3 Chart ===============//

    let[T3data,setT3data]=useState([
        { date: "2025-03-01", t3: 2.1 },
        { date: "2025-04-01", t3: 2.6 },
        { date: "2025-05-01", t3: 3.2 },
        { date: "2025-06-01", t3: 2.7 },
        { date: "2025-07-01", t3: 2.3 },
        { date: "2025-08-01", t3: 2.7 },
        { date: "2025-09-01", t3: 2.4 },
        { date: "2025-10-01", t3: 2.8 },
        { date: "2025-11-01", t3: 2.0 },
        { date: "2025-12-01", t3: 2.2 },
        { date: "2026-01-01", t3: 2.7 },
        { date: "2026-02-01", t3: 2.1 },
        { date: "2026-03-01", t3: 2.6 },
    ])

    const [T3range, setT3Range] = useState("6m"); // 1m | 6m | 1y | all

    // 1) فلترة البيانات حسب الفترة
    const T3filteredData = useMemo(() => {
        const T3sorted = [...T3data].sort((a, b) => new Date(a.date) - new Date(b.date));
        if (T3range === "all") return T3sorted;

        const T3months = T3range === "1m" ? 1 : T3range === "6m" ? 6 : 12;
        const T3from = new Date();
        T3from.setMonth(T3from.getMonth() - T3months);

        return T3sorted.filter((p) => new Date(p.date) >= T3from);
    }, [T3data, T3range]);

    // 2) تجهيز الداتا للشارت
    const T3series = useMemo(
    () => [{
        name: "T3",
        data: T3filteredData.map((p) => p.t3),
    },],[T3filteredData]);

    const T3options = {
      chart: {
        type: "bar",
        toolbar: { show: false },
        zoom: { enabled: false },
      },
      stroke: {
        curve: "smooth",
        width: 3,
      },
      plotOptions: {
        bar: {
          borderRadius: 8,      // يخلي الأعمدة ناعمة
          columnWidth: "45%",   // عرض العمود
        },
      },
      dataLabels: { enabled: false },
      colors: ["#00B3A1"],
      fill: { opacity: 0.25 },
      xaxis: {
        categories: T3filteredData.map((p) => p.date), // التاريخ تحت الأعمدة
        labels: {rotate: -30,},
      },
      grid: {
        borderColor: "rgba(0,0,0,0.2)", // لو الخلفية فاتحة ومحتاج خطوط أغمق
        strokeDashArray: 4,
      },
      tooltip: {
        y: {formatter: (val) => `${val} pg/mL`,},
      },
      yaxis: {
        title: { text: "T3 (pg/mL)" },
        decimalsInFloat: 1,
      },
    };

    //=============== T3 Chart ===============//

    //=============== T4 Chart ===============//

    let[T4data,setT4data]=useState([
        { date: "2025-03-01", t4: 2.1 },
        { date: "2025-04-01", t4: 2.6 },
        { date: "2025-05-01", t4: 3.2 },
        { date: "2025-06-01", t4: 2.7 },
        { date: "2025-07-01", t4: 2.3 },
        { date: "2025-08-01", t4: 2.7 },
        { date: "2025-09-01", t4: 2.4 },
        { date: "2025-10-01", t4: 2.8 },
        { date: "2025-11-01", t4: 2.0 },
        { date: "2025-12-01", t4: 2.2 },
        { date: "2026-01-01", t4: 2.7 },
        { date: "2026-02-01", t4: 2.1 },
        { date: "2026-03-01", t4: 2.6 },
    ])

    const [T4range, setT4Range] = useState("6m"); // 1m | 6m | 1y | all

  const T4filteredData = useMemo(() => {
    const T4sorted = [...T4data].sort((a, b) => new Date(a.date) - new Date(b.date));
    if (T4range === "all") return T4sorted;

    const T4months = T4range === "1m" ? 1 : T4range === "6m" ? 6 : 12;
    const T4from = new Date();
    T4from.setMonth(T4from.getMonth() - T4months);
    return T4sorted.filter((p) => new Date(p.date) >= T4from);
  }, [T4data, T4range]);

  const T4series = useMemo(
    () => [
      {
        name: "T4",
        data: T4filteredData.map((p) => p.t4),
      },
    ],
    [T4filteredData]
  );

  const T4options = {
    chart: { type: "bar", toolbar: { show: false } },
    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 10,
        barHeight: "55%",
      },
    },
    dataLabels: { enabled: false },

    colors: ["rgba(0, 179, 161, 0.28)"],
    stroke: {
      show: true,
      width: 2,
      colors: ["#00B3A1"],
    },

    xaxis: {
      categories: T4filteredData.map((p) => p.date),
      title: { text: "T4 (ng/dL)" },
      labels: { style: { colors: "#000" } },
    },
    yaxis: {
      labels: { style: { colors: "#000" } },
    },

    grid: {
      borderColor: "rgba(0,0,0,0.2)",
      strokeDashArray: 4,
    },

    tooltip: {
      x: { formatter: (_, opts) => T4filteredData[opts.dataPointIndex]?.date },
      y: { formatter: (val) => `${val} ng/dL` },
    },
  };

    //=============== T4 Chart ===============//

    //=============== TSH Chart ===============//

    let[TSHdata,setTSHdata]=useState([
        { date: "2025-03-01", tsh: 2.1 },
        { date: "2025-04-01", tsh: 2.6 },
        { date: "2025-05-01", tsh: 3.2 },
        { date: "2025-06-01", tsh: 2.7 },
        { date: "2025-07-01", tsh: 2.3 },
        { date: "2025-08-01", tsh: 2.7 },
        { date: "2025-09-01", tsh: 2.4 },
        { date: "2025-10-01", tsh: 2.8 },
        { date: "2025-11-01", tsh: 2.0 },
        { date: "2025-12-01", tsh: 2.2 },
        { date: "2026-01-01", tsh: 2.7 },
        { date: "2026-02-01", tsh: 2.1 },
        { date: "2026-03-01", tsh: 2.6 },
    ])

    const [TSHrange, setTSHRange] = useState("6m"); // 1m | 6m | 1y | all

    // 1) data filtering
    const TSHfilteredData = useMemo(() => { // useMemo calculates the block of code only once until the code is changed

        const TSHsorted = [...TSHdata].sort((a, b) => new Date(a.date) - new Date(b.date));
        if (TSHrange === "all") return TSHsorted;

        const TSHmonths = TSHrange === "1m" ? 1 : TSHrange === "6m" ? 6 : 12;
        const TSHfrom = new Date();
        TSHfrom.setMonth(TSHfrom.getMonth() - TSHmonths); // تاريخ البداية (من كام شهر)

        return TSHsorted.filter((p) => new Date(p.date) >= TSHfrom);
    }, [TSHdata, TSHrange]);

    // 2) chart preparing
    const TSHseries = useMemo(
        () => [{
            name: "TSH",
            data: TSHfilteredData.map((p) => [new Date(p.date).getTime(), p.tsh]),
        },],
        [TSHfilteredData]
    );

    // 3) chart settings
    const TSHoptions = {
        chart: { type: "area", toolbar: { show: false }, zoom: { enabled: false } },
        stroke: { curve: "smooth", width: 3 },
        dataLabels: { enabled: false },
        xaxis: { type: "datetime" , labels:{style:{colors:"#000"}}},
        ysxis:{labels:{style:{colors:"#000"}}},
        colors: ["#00B3A1"],
        fill: { opacity: 0.25 },
        tooltip: { x: { format: "dd MMM yyyy" } },
    };
    //=============== TSH Chart ===============//

    //=============== Symptom Tracker ===============//

    let[STdata,setSTdata]=useState([
        { date: "2024-08-01", fatigue: 6, anxiety: 3, insomnia: 4, hairLoss: 5, palpitations: 2, coldIntolerance: 7, },
        { date: "2024-09-01", fatigue: 7, anxiety: 4, insomnia: 5, hairLoss: 6, palpitations: 3, coldIntolerance: 8, },
        { date: "2024-10-01", fatigue: 8, anxiety: 5, insomnia: 6, hairLoss: 7, palpitations: 4, coldIntolerance: 8, },
        { date: "2024-11-01", fatigue: 7, anxiety: 6, insomnia: 7, hairLoss: 6, palpitations: 5, coldIntolerance: 7, },
        { date: "2024-12-01", fatigue: 6, anxiety: 5, insomnia: 6, hairLoss: 5, palpitations: 4, coldIntolerance: 6, },
        { date: "2025-01-01", fatigue: 5, anxiety: 4, insomnia: 5, hairLoss: 4, palpitations: 3, coldIntolerance: 6, },
        { date: "2025-02-01", fatigue: 4, anxiety: 3, insomnia: 4, hairLoss: 3, palpitations: 2, coldIntolerance: 5, },
        { date: "2025-03-01", fatigue: 5, anxiety: 4, insomnia: 4, hairLoss: 4, palpitations: 3, coldIntolerance: 6, },
        { date: "2025-04-01", fatigue: 6, anxiety: 5, insomnia: 5, hairLoss: 5, palpitations: 4, coldIntolerance: 7, },
        { date: "2025-05-01", fatigue: 5, anxiety: 4, insomnia: 4, hairLoss: 4, palpitations: 3, coldIntolerance: 6, },
        { date: "2025-06-01", fatigue: 4, anxiety: 3, insomnia: 3, hairLoss: 3, palpitations: 2, coldIntolerance: 5, },
        { date: "2025-07-01", fatigue: 3, anxiety: 2, insomnia: 3, hairLoss: 2, palpitations: 1, coldIntolerance: 4, },
        { date: "2026-03-01", fatigue: 8, anxiety: 4, insomnia: 8, hairLoss: 2, palpitations: 9, coldIntolerance: 7, },
        { date: "2026-03-08", fatigue: 2, anxiety: 2, insomnia: 2, hairLoss: 2, palpitations: 2, coldIntolerance: 2, },
    ])

    const [STselectedMonth, setSTSelectedMonth] = useState("2026-03");

    const STavailableMonths = useMemo(() => {
      const months = STdata.map((x) => String(x.date).slice(0, 7)).filter(Boolean);
      return Array.from(new Set(months)).sort(); // unique + sorted
    }, [STdata]);

    useEffect(() => {
      if (!STavailableMonths.length) return;

      if (!STavailableMonths.includes(STselectedMonth)) {
        setSTSelectedMonth(STavailableMonths[STavailableMonths.length - 1]);
      }
    }, [STavailableMonths, STselectedMonth]);

    const STfiltered = useMemo(() => {
      return STdata.filter((item) => String(item.date).slice(0, 7) === STselectedMonth);
    }, [STdata, STselectedMonth]);

    const STlast = STfiltered[STfiltered.length - 1];


    const STcategories = [
      "Fatigue",
      "Anxiety",
      "Insomnia",
      "Hair Loss",
      "Palpitations",
      "Cold Intolerance",
    ];

    const STseries = STlast? [
      {
        name: "Severity (0-10)",
        data: [
          Number(STlast.fatigue) || 0,
          Number(STlast.anxiety) || 0,
          Number(STlast.insomnia) || 0,
          Number(STlast.hairLoss) || 0,
          Number(STlast.palpitations) || 0,
          Number(STlast.coldIntolerance) || 0,
        ],
      },]
    : [];

    const SToptions = {
      chart: { type: "radar", toolbar: { show: false } },

      xaxis: {
        categories: STcategories,
        labels: { style: { colors: "#000" } },
      },
      yaxis: { min: 0, max: 10, tickAmount: 5 },
      stroke: { width: 3 },
      fill: { opacity: 0.25 },
      colors: ["#00B3A1"],
      dataLabels: { enabled: false },

      grid: { borderColor: "rgba(0,0,0,0.35)" },

      plotOptions: {
        radar: {
          polygons: {
            strokeColors: "rgba(0,0,0,0.45)",
            connectorColors: "rgba(0,0,0,0.45)",
          },
        },
      },
    };

    //=============== Symptom Tracker ===============//

    return <>
        <div className="background-DB">

            <div className="h-25"></div>

            <div className="background-card mx-5 md:mx-20 grid gap-5 p-5 md:grid-cols-12">
                <div className="md:col-span-8 text-center md:text-left md:flex md:flex-col md:justify-center">
                    <p className="font-1 text-3xl ">Welcome,<span className="color-1"> {user?.firstName}</span></p>
                    <p className="font-1 text-3xl ">Your thyroid levels are <span className="text-amber-600">critical</span> today.</p>
                    <button className="background-1 w-33 py-2 mt-6 text-white font-1 rounded-full cursor-pointer">Download PDF</button>
                </div>
                <div className="md:col-span-4 flex items-center justify-center">
                    <div className="relative">
                        <svg width={size} height={size}>
                            <circle stroke="rgba(0,0,0,0.1)" fill="transparent" strokeWidth={strokeWidth} r={radius} cx={size / 2} cy={size / 2}/>
                            <circle stroke="#e17100" fill="transparent" strokeWidth={strokeWidth} strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset} r={radius} cx={size / 2} cy={size / 2} style={{ transition: "stroke-dashoffset 0.8s ease", transform: "rotate(-90deg)", transformOrigin: "50% 50%", }} />
                        </svg>

                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-3xl font-bold text-amber-600">{value}% </span>
                            <span className="text-sm text-gray-600 mt-1"> Health Stability </span>
                        </div>
                    </div>
                </div>    
            </div>

            <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 mx-5 md:mx-20 mt-10">

                <div className="background-card p-5">
                    <p className="text-center font-1 text-2xl">Current Condition</p>
                    <div className="flex flex-wrap justify-center gap-4 mt-4">
                        <div className="bg-white w-15 my-auto h-15 rounded-full flex">
                            <i className="fa-solid fa-hand-holding-medical text-4xl mx-auto my-auto color-1"></i>
                        </div>
                        <div>
                            <p className="font-1 text-xl">Hypothyroidism</p>
                            <p className="font-1 text-lg">Stable condition</p>
                            <p className="font-1 color-1 text-[15px]">Last updated: Today</p>
                        </div>
                    </div>
                </div>

                <div className="background-card p-5">
                    <p className="text-center font-1 text-2xl">Medication Status</p>
                    <div className="flex flex-wrap justify-center gap-4 mt-4">
                        <div className="bg-white w-15 my-auto h-15 rounded-full flex">
                            <i className="fa-solid fa-pills text-4xl mx-auto my-auto color-1"></i>
                        </div>
                        <div>
                            <p className="font-1 text-xl">Levothyroxine</p>
                            <p className="font-1 text-lg">75 mcg daily</p>
                            <p className="font-1 color-1 text-[15px]">Next refill in 12 days</p>
                        </div>
                    </div>
                </div>

                <div className="background-card p-5">
                    <p className="text-center font-1 text-2xl">Next Appointment</p>
                    <div className="flex flex-wrap justify-center gap-4 mt-4">
                        <div className="bg-white w-15 my-auto h-15 rounded-full flex">
                            <i className="fa-regular fa-calendar text-4xl mx-auto my-auto color-1"></i>
                        </div>
                        <div>
                            <p className="font-1 text-xl">Dr. Sarah Johnson</p>
                            <p className="font-1 color-1 text-[15px]">June 15, 2023</p>
                            <p className="font-1 color-1 text-[15px]">10:30 AM</p>
                        </div>
                    </div>
                </div>

            </div>

            <div className="grid gap-5 md:grid-cols-2 mx-5 md:mx-20 mt-10" >

                <div className="background-card p-5 overflow-hidden">
                   <p className="text-center font-1 text-2xl">T3 Levels</p> 
                   <div className="mt-4">
                        <div className="flex gap-2 mb-4 justify-center">
                            <button onClick={() => setT3Range("1m")} className={`px-3 py-1 rounded-lg ${T3range === "1m"? "bg-amber-600": "background-1"} text-white hover:bg-amber-600! transition duration-300`}>1M</button>
                            <button onClick={() => setT3Range("6m")} className={`px-3 py-1 rounded-lg ${T3range === "6m"? "bg-amber-600": "background-1"} text-white hover:bg-amber-600! transition duration-300`}>6M</button>
                            <button onClick={() => setT3Range("1y")} className={`px-3 py-1 rounded-lg ${T3range === "1y"? "bg-amber-600": "background-1"} text-white hover:bg-amber-600! transition duration-300`}>1Y</button>
                            <button onClick={() => setT3Range("all")} className={`px-3 py-1 rounded-lg ${T3range === "all"? "bg-amber-600": "background-1"} text-white hover:bg-amber-600! transition duration-300`}>ALL</button>
                        </div>
                        <Chart options={T3options} series={T3series} type="bar" height={320}/>
                   </div>
                </div>

                <div className="background-card p-5 overflow-hidden">
                   <p className="text-center font-1 text-2xl">T4 Levels</p> 
                   <div className="mt-4">
                        <div className="flex gap-2 mb-4 justify-center">
                            <button onClick={() => setT4Range("1m")} className={`px-3 py-1 rounded-lg ${T4range === "1m"? "bg-amber-600": "background-1"} text-white hover:bg-amber-600! transition duration-300`}>1M</button>
                            <button onClick={() => setT4Range("6m")} className={`px-3 py-1 rounded-lg ${T4range === "6m"? "bg-amber-600": "background-1"} text-white hover:bg-amber-600! transition duration-300`}>6M</button>
                            <button onClick={() => setT4Range("1y")} className={`px-3 py-1 rounded-lg ${T4range === "1y"? "bg-amber-600": "background-1"} text-white hover:bg-amber-600! transition duration-300`}>1Y</button>
                            <button onClick={() => setT4Range("all")} className={`px-3 py-1 rounded-lg ${T4range === "all"? "bg-amber-600": "background-1"} text-white hover:bg-amber-600! transition duration-300`}>ALL</button>
                        </div>
                        <Chart options={T4options} series={T4series} type="bar" height={320}/>
                   </div>
                </div>

                <div className="background-card p-5 overflow-hidden">
                   <p className="text-center font-1 text-2xl">TSH Levels</p> 
                   <div className="mt-4">
                        <div className="flex gap-2 mb-4 justify-center">
                            <button onClick={() => setTSHRange("1m")} className={`px-3 py-1 rounded-lg ${TSHrange === "1m"? "bg-amber-600": "background-1"} text-white hover:bg-amber-600! transition duration-300`}>1M</button>
                            <button onClick={() => setTSHRange("6m")} className={`px-3 py-1 rounded-lg ${TSHrange === "6m"? "bg-amber-600": "background-1"} text-white hover:bg-amber-600! transition duration-300`}>6M</button>
                            <button onClick={() => setTSHRange("1y")} className={`px-3 py-1 rounded-lg ${TSHrange === "1y"? "bg-amber-600": "background-1"} text-white hover:bg-amber-600! transition duration-300`}>1Y</button>
                            <button onClick={() => setTSHRange("all")} className={`px-3 py-1 rounded-lg ${TSHrange === "all"? "bg-amber-600": "background-1"} text-white hover:bg-amber-600! transition duration-300`}>ALL</button>
                        </div>
                        <Chart options={TSHoptions} series={TSHseries} type="area" height={320} />
                   </div>
                </div>

                <div className="background-card p-5 overflow-hidden">
                   <p className="text-center font-1 text-2xl">Symptom Tracker</p> 
                   <div className="mt-4">
                        <div className="flex mb-4 justify-center">
                            <select value={STselectedMonth} onChange={(e) => setSTSelectedMonth(e.target.value)} className="px-10 py-2 rounded-lg color-1 font-1">
                                {STavailableMonths.map((m) => ( <option key={m} value={m} className="text-black"> {m} </option> ))}
                            </select>
                        </div>
                        <Chart options={SToptions} series={STseries} type="radar" height={400} />
                   </div>
                </div>

            </div>

            <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 mx-5 md:mx-20 mt-10">

                <div className="background-card p-5">
                    <p className="text-center font-1 text-2xl">TSH</p>
                    <p className="font-1 text-xl mt-4">Current : <span className="color-1">2.5 mIU/L</span></p>
                    <p className="font-1 text-xl mt-2">Previous : <span className="color-1">3.8 mIU/L</span></p>
                    <p className="font-1 text-xl mt-2">Change : <span className="text-amber-600">-1.3</span></p>
                </div>

                <div className="background-card p-5">
                    <p className="text-center font-1 text-2xl">Free T4</p>
                    <p className="font-1 text-xl mt-4">Current : <span className="color-1">1.1 ng/dL</span></p>
                    <p className="font-1 text-xl mt-2">Previous : <span className="color-1">0.9 ng/dL</span></p>
                    <p className="font-1 text-xl mt-2">Change : <span className="text-amber-600">+0.2</span></p>
                </div>

                <div className="background-card p-5">
                    <p className="text-center font-1 text-2xl">Free T3</p>
                    <p className="font-1 text-xl mt-4">Current : <span className="color-1">3.2 pg/mL</span></p>
                    <p className="font-1 text-xl mt-2">Previous : <span className="color-1">3.0 pg/mL</span></p>
                    <p className="font-1 text-xl mt-2">Change : <span className="text-amber-600">+0.2</span></p>
                </div>

            </div>

            <div className="background-card mt-10 mx-5 md:mx-20 p-5">
                <p className="text-center font-1 text-2xl">Recommended Actions</p>
                <p className="font-1 text-xl mt-4"><span className="background-1 inline-block w-7 h-7 text-center text-white rounded-full mr-1">1</span> Continue current medication dosage as prescribed </p>
                <p className="font-1 text-xl mt-2"><span className="background-1 inline-block w-7 h-7 text-center text-white rounded-full mr-1">2</span> Schedule next blood test in 3 months </p>
                <p className="font-1 text-xl mt-2"><span className="background-1 inline-block w-7 h-7 text-center text-white rounded-full mr-1">3</span> Increase water intake to help with dry skin symptoms </p>
                <p className="font-1 text-xl mt-2"><span className="background-1 inline-block w-7 h-7 text-center text-white rounded-full mr-1">4</span> Consider adding selenium-rich foods to your diet </p>
                <p className="font-1 text-xl mt-2"><span className="background-1 inline-block w-7 h-7 text-center text-white rounded-full mr-1">5</span> Continue current medication dosage as prescribed </p>
            </div>

            <div className="h-15"></div>
        </div>
    </>
}