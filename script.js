// การตั้งค่า MQTT Broker
const brokerUrl = "wss://broker.hivemq.com:8884/mqtt";  // HiveMQ WebSocket URL
const topic = "phycom/66070086";  // ระบุ topic ที่ต้องการสมัครรับข้อมูล

// สร้างการเชื่อมต่อ
const client = mqtt.connect(brokerUrl);

// เมื่อเชื่อมต่อสำเร็จ
client.on("connect", () => {
    console.log("Connected to MQTT Broker");
    client.subscribe(topic, (err) => {
        if (!err) {
            console.log(`Subscribed to topic: ${topic}`);
        } else {
            console.error("Failed to subscribe:", err);
        }
    });
});

// เมื่อได้รับข้อความจาก Broker
client.on("message", (topic, message) => {
    const mqttDataList = document.getElementById("mqtt-data-list");
    const dataItem = document.createElement("div");
    const timestamp = new Date().toLocaleTimeString();

    // ตรวจสอบข้อความที่ได้รับเป็น "IN" หรือ "OUT"
    if (message.toString().trim().toUpperCase() === "IN") {
        dataItem.classList.add("data-item", "in");  // กำหนด class สำหรับ "IN"
        dataItem.textContent = `[${timestamp}] IN`;
    } else if (message.toString().trim().toUpperCase() === "OUT") {
        dataItem.classList.add("data-item", "out");  // กำหนด class สำหรับ "OUT"
        dataItem.textContent = `[${timestamp}] OUT`;
    } else {
        // ถ้ามีข้อความอื่น ๆ แสดงเป็นข้อความปกติ
        dataItem.classList.add("data-item");
        dataItem.textContent = `[${timestamp}] ${message.toString()}`;
    }

    mqttDataList.prepend(dataItem);  // เพิ่มข้อมูลใหม่ที่ด้านบนสุด
    console.log(`Received message on ${topic}: ${message}`);
});