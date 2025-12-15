import { useSocket } from '../../hooks/useSocket';

export const ConnectionStatus = () => {
  const { isConnected } = useSocket();

  return (
    <div className="fixed bottom-4 right-4 flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-full shadow-lg">
      <div
        className={`w-2 h-2 rounded-full ${
          isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'
        }`}
      ></div>
      <span className="text-xs font-medium text-gray-700">
        {isConnected ? 'Real-time connected' : 'Disconnected'}
      </span>
    </div>
  );
};

export default ConnectionStatus;