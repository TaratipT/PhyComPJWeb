// การตั้งค่า MQTT Broker
const brokerUrl = "wss://broker.hivemq.com:8884/mqtt";
const topic = "peter/parkdui";
let count = 4; // จำนวนเริ่มต้น

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

// อัปเดตสีของตัวเลขโดยใช้เฉดสีจากเขียวไปแดง
function updateCounterColor() {
    const counterElement = document.getElementById("counter");
    counterElement.textContent = count;

    // การคำนวณเฉดสีเขียวแดงโดยไม่มีสีเหลืองตรงกลาง
    let green = Math.max(0, 255 - Math.abs(count - 4) * 40);
    let red = Math.min(255, Math.abs(count - 4) * 40);

    counterElement.style.backgroundColor = `rgb(${red}, ${green}, 0)`;
}

// เมื่อได้รับข้อความจาก Broker
client.on("message", (topic, message) => {
    const mqttDataList = document.getElementById("mqtt-data-list");
    const dataItem = document.createElement("div");
    const timestamp = new Date().toLocaleTimeString();
    const msg = message.toString().trim().toUpperCase();

    // อัปเดตจำนวนตามสถานะ IN/OUT
    if (msg === "IN") {
        dataItem.classList.add("data-item", "in");
        dataItem.textContent = `[${timestamp}] IN`;
        count--;  // ลดจำนวนลงเมื่อได้รับ IN
    } else if (msg === "OUT") {
        dataItem.classList.add("data-item", "out");
        dataItem.textContent = `[${timestamp}] OUT`;
        count++;  // เพิ่มจำนวนเมื่อได้รับ OUT
    } else {
        return;  // ข้ามการแสดงผลหากไม่ใช่ "IN" หรือ "OUT"
    }

    updateCounterColor();  // อัปเดตตัวนับพร้อมสี
    mqttDataList.prepend(dataItem);  // เพิ่มข้อมูลใหม่ที่ด้านบนสุด
    console.log(`Received message on ${topic}: ${message}`);
});
