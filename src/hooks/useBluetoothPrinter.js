import { useState, useEffect, useCallback, useRef } from 'react';

// Common Bluetooth Thermal Printer Service & Characteristic UUIDs
export const PRINTER_SERVICES = [
  '000018f0-0000-1000-8000-00805f9b34fb', // Standard POS Printer Service
  'e7810a71-73ae-499d-8c15-faa9aef0c3f2',
  '49535343-fe7d-4ae5-8fa9-9fafd205e455',
  '0000ff00-0000-1000-8000-00805f9b34fb',
  '0000ae30-0000-1000-8000-00805f9b34fb',
  '0000af30-0000-1000-8000-00805f9b34fb',
];

export const PRINTER_CHARACTERISTICS = [
  '00002af1-0000-1000-8000-00805f9b34fb', // Standard write characteristic
  'bef8d6c9-9c21-4c9e-b632-bd58c1009f9f',
  '49535343-8841-43f4-a8d4-ecbe34729bb3',
  '0000ff02-0000-1000-8000-00805f9b34fb',
  '0000ae01-0000-1000-8000-00805f9b34fb',
  '0000af01-0000-1000-8000-00805f9b34fb',
];

export function useBluetoothPrinter() {
  const [device, setDevice] = useState(null);
  const [pairedDevice, setPairedDevice] = useState(null);
  const [characteristic, setCharacteristic] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [isSupported, setIsSupported] = useState(true);

  const activeDeviceRef = useRef(null);

  // Check Web Bluetooth support and previously paired devices on Mount
  useEffect(() => {
    if (!navigator.bluetooth) {
      setIsSupported(false);
      setStatusMessage('Browser tidak mendukung Web Bluetooth. Gunakan Chrome di Android/Desktop.');
      return;
    }

    const checkPreviousDevices = async () => {
      try {
        if (typeof navigator.bluetooth.getDevices === 'function') {
          const devices = await navigator.bluetooth.getDevices();
          if (devices && devices.length > 0) {
            const lastDevice = devices[0];
            setPairedDevice(lastDevice);
            setStatusMessage(`Printer tersimpan terdeteksi: ${lastDevice.name || 'Printer Bluetooth'}`);
          }
        }
      } catch (err) {
        console.warn('Gagal memeriksa perangkat tersimpan:', err);
      }
    };

    checkPreviousDevices();
  }, []);

  // Handle GATT disconnection
  const handleDisconnection = useCallback(() => {
    setIsConnected(false);
    setCharacteristic(null);
    setStatusMessage('Printer terputus');
  }, []);

  // Helper to connect to a BluetoothDevice instance and discover write characteristic
  const connectGattServer = useCallback(async (targetDevice) => {
    setIsConnecting(true);
    setStatusMessage(`Menghubungkan ke ${targetDevice.name || 'Printer'}...`);

    try {
      targetDevice.removeEventListener('gattserverdisconnected', handleDisconnection);
      targetDevice.addEventListener('gattserverdisconnected', handleDisconnection);

      const server = await targetDevice.gatt.connect();
      setStatusMessage('Mencari layanan cetak...');

      let writeChar = null;

      // Try discovering primary services from known UUIDs
      for (const serviceUuid of PRINTER_SERVICES) {
        try {
          const service = await server.getPrimaryService(serviceUuid);
          const chars = await service.getCharacteristics();
          
          for (const char of chars) {
            if (char.properties.write || char.properties.writeWithoutResponse) {
              writeChar = char;
              break;
            }
          }
          if (writeChar) break;
        } catch {
          // Continue trying other service UUIDs
        }
      }

      // If not found in known UUIDs, try querying all primary services
      if (!writeChar) {
        try {
          const services = await server.getPrimaryServices();
          for (const service of services) {
            const chars = await service.getCharacteristics();
            for (const char of chars) {
              if (char.properties.write || char.properties.writeWithoutResponse) {
                writeChar = char;
                break;
              }
            }
            if (writeChar) break;
          }
        } catch {
          // Fallback discovery
        }
      }

      if (!writeChar) {
        throw new Error('Karakteristik cetak tidak ditemukan pada printer ini.');
      }

      activeDeviceRef.current = targetDevice;
      setDevice(targetDevice);
      setPairedDevice(targetDevice);
      setCharacteristic(writeChar);
      setIsConnected(true);
      setStatusMessage(`Terhubung ke ${targetDevice.name || 'Printer Thermal'}`);
      return true;
    } catch (error) {
      console.error('Koneksi Bluetooth gagal:', error);
      setIsConnected(false);
      setCharacteristic(null);
      setStatusMessage(`Gagal koneksi: ${error.message || 'Perangkat tidak merespon'}`);
      return false;
    } finally {
      setIsConnecting(false);
    }
  }, [handleDisconnection]);

  // Request a new Bluetooth device (Cari Printer Baru)
  const requestNewPrinter = useCallback(async () => {
    if (!navigator.bluetooth) {
      alert('Browser Anda tidak mendukung Web Bluetooth API.');
      return false;
    }

    try {
      setIsConnecting(true);
      setStatusMessage('Membuka jendela pencarian printer...');

      let selectedDevice;
      try {
        // First try with standard filters
        selectedDevice = await navigator.bluetooth.requestDevice({
          filters: [
            { services: ['000018f0-0000-1000-8000-00805f9b34fb'] }
          ],
          optionalServices: PRINTER_SERVICES
        });
      } catch {
        // Fallback with acceptAllDevices for broadest printer compatibility
        selectedDevice = await navigator.bluetooth.requestDevice({
          acceptAllDevices: true,
          optionalServices: PRINTER_SERVICES
        });
      }

      if (selectedDevice) {
        return await connectGattServer(selectedDevice);
      }
      return false;
    } catch (error) {
      if (error.name === 'NotFoundError') {
        setStatusMessage('Pencarian printer dibatalkan.');
      } else {
        setStatusMessage(`Error: ${error.message}`);
      }
      return false;
    } finally {
      setIsConnecting(false);
    }
  }, [connectGattServer]);

  // Reconnect to previously paired printer without browser popup
  const reconnectPrinter = useCallback(async () => {
    const target = pairedDevice || device || activeDeviceRef.current;
    if (!target) {
      return requestNewPrinter();
    }
    return await connectGattServer(target);
  }, [pairedDevice, device, connectGattServer, requestNewPrinter]);

  // Disconnect active printer
  const disconnectPrinter = useCallback(() => {
    if (device && device.gatt && device.gatt.connected) {
      device.gatt.disconnect();
    }
    setIsConnected(false);
    setCharacteristic(null);
    setStatusMessage('Printer diputuskan secara manual');
  }, [device]);

  // Print binary buffer with MTU-safe chunking
  const printBuffer = useCallback(async (bufferUint8) => {
    if (!characteristic || !isConnected) {
      throw new Error('Printer belum terhubung via Bluetooth.');
    }

    setIsPrinting(true);
    setStatusMessage('Mengirim data ke printer...');

    try {
      const CHUNK_SIZE = 64; // Safe chunk size for BLE MTU
      const totalBytes = bufferUint8.length;
      let offset = 0;

      while (offset < totalBytes) {
        const chunk = bufferUint8.slice(offset, offset + CHUNK_SIZE);
        
        if (characteristic.properties.writeWithoutResponse) {
          await characteristic.writeValueWithoutResponse(chunk);
        } else {
          await characteristic.writeValue(chunk);
        }

        offset += CHUNK_SIZE;
        // Small delay between chunks to let thermal printer hardware buffer process
        await new Promise((resolve) => setTimeout(resolve, 25));
      }

      setStatusMessage('Struk berhasil dicetak!');
      return true;
    } catch (error) {
      console.error('Error saat mencetak:', error);
      setStatusMessage(`Gagal mencetak: ${error.message}`);
      throw error;
    } finally {
      setIsPrinting(false);
    }
  }, [characteristic, isConnected]);

  return {
    isSupported,
    device,
    pairedDevice,
    isConnected,
    isConnecting,
    isPrinting,
    statusMessage,
    requestNewPrinter,
    reconnectPrinter,
    disconnectPrinter,
    printBuffer
  };
}
