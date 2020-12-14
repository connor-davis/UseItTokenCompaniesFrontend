import React, {useEffect, useRef, useState} from "react";

import {useSelector} from "react-redux";

import {BiMoney, FaAddressBook, FaMap, GiHouse, GiModernCity, GiTreeBranch, MdEmail, MdPhone} from "react-icons/all";

import Barcode from "react-barcode";

import LoadingPage from "../loading.page";
import {selectCollectors} from "../../slices/collector.slice";
import "../../styles/global.scss";
import "../../styles/user.info.scss";

function CollectorInfo({match}) {
    let [collector, setCollector] = useState({});
    let collectors = useSelector(selectCollectors);

    let canvasRef = useRef(null);
    let canvas = canvasRef.current;

    let barcodeRef = useRef(null);
    let barcode = barcodeRef.current;

    let {uid} = match.params;

    useEffect(() => {
        let collector = collectors.filter((filter) => filter.uid === uid)[0];
        setCollector(collector);

        if (canvas && barcode) {
            let barcodeElement = barcode.refs.renderElement;

            if (canvas instanceof HTMLCanvasElement && barcodeElement instanceof SVGElement) {
                let context = canvas.getContext("2d");
                let logo = new Image(1024, 1024);
                let barcodeImage = new Image(600, 200);

                let xml = new XMLSerializer().serializeToString(barcodeElement);
                let svg64 = btoa(xml);
                let barcodeImage64 = "data:image/svg+xml;base64," + svg64;

                barcodeImage.onload = () => {
                    context.drawImage(barcodeImage, 60, (context.canvas.height / 2) - 100, context.canvas.width - 120, 200);
                }

                barcodeImage.src = barcodeImage64;

                logo.onload = () => {
                    context.drawImage(logo, 100, 100, 128, 128);
                }

                logo.src = "logo.png";

                let rectX = 0;
                let rectY = 0;
                let rectWidth = context.canvas.width;
                let rectHeight = context.canvas.height;
                let cornerRadius = 20;

                context.fillStyle = "#effff2";

                context.roundRect(rectX, rectY, rectWidth, rectHeight, cornerRadius).fill();

                context.fillStyle = "#007d23";

                context.font = "60pt Calibri";
                context.fillText("Token Card", 248, 200);

                context.font = "bold 50pt Arial";
                context.fillText(collector.name, 60, context.canvas.height - 155);

                context.font = "40pt Arial";
                context.fillText(collector.accountNumber, 60, context.canvas.height - 70);

                context.font = "20pt Arial";
                context.fillText("ACCOUNT NUMBER", 60, context.canvas.height - 20);

                context.font = "40pt Arial";
                let accountNumberWidth = context.measureText(collector.accountNumber);

                context.font = "40pt Arial";
                context.fillText(collector.branchCode, 120 + accountNumberWidth.width, context.canvas.height - 70);

                context.font = "20pt Arial";
                context.fillText("BRANCH CODE", 120 + accountNumberWidth.width, context.canvas.height - 20);
            }
        }
    }, [uid, collectors, canvas, barcode]);

    return uid ?
        <div className="user-info-page">
            <div className="user-info-card">
                <h3>{collector.name}</h3>

                <div className="divider-horizontal"/>
                <div className="divider-horizontal"/>

                <div className="user-info-card-content">
                    <div className="user-info-contact">
                        <div>Contact Details</div>

                        <div className="divider-horizontal"/>

                        <div className="user-info-contact-row">
                            <MdEmail/>
                            <div className="divider-vertical"/>
                            {collector.email}
                        </div>
                        <div className="user-info-contact-row">
                            <MdPhone/>
                            <div className="divider-vertical"/>
                            {collector.phoneNumber}
                        </div>
                    </div>

                    <div className="divider-horizontal"/>
                    <div className="divider-horizontal"/>

                    <div className="user-info-token-details">
                        <div>Payment Details</div>

                        <div className="divider-horizontal"/>

                        <div className="user-info-token-details-row">
                            <BiMoney/>
                            <div className="divider-vertical"/>
                            {collector.balance}
                        </div>

                        <div className="user-info-token-details-row">
                            <FaAddressBook/>
                            <div className="divider-vertical"/>
                            {collector.accountNumber}
                        </div>

                        <div className="user-info-token-details-row">
                            <GiTreeBranch/>
                            <div className="divider-vertical"/>
                            {collector.branchCode}
                        </div>
                    </div>

                    <div className="divider-horizontal"/>
                    <div className="divider-horizontal"/>

                    {collector.address ?
                        <div className="user-info-address-details">
                            <div>Address Details</div>

                            <div className="divider-horizontal"/>

                            <div className="user-info-token-details-row">
                                <GiHouse/>
                                <div className="divider-vertical"/>
                                {collector.address.street}
                            </div>

                            <div className="user-info-token-details-row">
                                <GiModernCity/>
                                <div className="divider-vertical"/>
                                {collector.address.city}
                            </div>

                            <div className="user-info-token-details-row">
                                <FaMap/>
                                <div className="divider-vertical"/>
                                {collector.province}
                            </div>
                        </div> : ""}
                </div>
            </div>

            <div className="user-info-card" style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                <div style={{display: "none"}}>
                    <Barcode ref={barcodeRef} fontSize={"30px"} format={"CODE128"} width={2} height={50}
                             value={uid.substr(0, 13)}
                             displayValue={false}/>
                </div>
                <div>
                    <canvas ref={canvasRef} className="card-preview" id="card-preview" width={1080} height={720}/>
                </div>
                <button>Export Card</button>
            </div>
        </div> : <LoadingPage/>;
}

export default CollectorInfo;