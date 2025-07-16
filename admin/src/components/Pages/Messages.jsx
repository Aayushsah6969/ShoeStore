import React, { useState } from 'react';
import { Mail, Trash2, Archive, Search } from 'lucide-react';
import { useDataStore } from '../../stores/dataStore';
import { useUIStore } from '../../stores/uiStore';

const Messages = () => {
  const { messages } = useDataStore();
  const { showToast } = useUIStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMessage, setSelectedMessage] = useState(null);

  const filteredMessages = messages.filter(message => 
    message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (messageId) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      showToast('Message deleted successfully', 'success');
    }
  };

  const handleArchive = (messageId) => {
    showToast('Message archived successfully', 'success');
  };

  const MessageDetailModal = ({ message, onClose }) => {
    if (!message) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">Message Details</h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
          </div>
          
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
              <p className="text-gray-900">{message.name}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <p className="text-gray-900">{message.email}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <p className="text-gray-900">{message.date}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-900 whitespace-pre-wrap">{message.message}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 pt-4">
              <button
                onClick={() => {
                  handleArchive(message.id);
                  onClose();
                }}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center"
              >
                <Archive className="w-4 h-4 mr-2" />
                Archive
              </button>
              <button
                onClick={() => {
                  handleDelete(message.id);
                  onClose();
                }}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Messages</h1>

      {/* Search */}
      <div className="bg-white rounded-lg shadow-sm p-6 border">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search messages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          />
        </div>
      </div>

      {/* Messages List */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="divide-y divide-gray-200">
          {filteredMessages.map((message) => (
            <div
              key={message.id}
              className="p-6 hover:bg-gray-50 cursor-pointer"
              onClick={() => setSelectedMessage(message)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{message.name}</h3>
                    <p className="text-sm text-gray-600">{message.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">{message.date}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleArchive(message.id);
                      }}
                      className="text-blue-600 hover:text-blue-800 p-1 rounded"
                    >
                      <Archive className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(message.id);
                      }}
                      className="text-red-600 hover:text-red-800 p-1 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-gray-700 line-clamp-2">{message.message}</p>
              </div>
            </div>
          ))}
        </div>
        
        {filteredMessages.length === 0 && (
          <div className="text-center py-12">
            <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <div className="text-gray-500">No messages found.</div>
          </div>
        )}
      </div>

      {/* Message Detail Modal */}
      {selectedMessage && (
        <MessageDetailModal
          message={selectedMessage}
          onClose={() => setSelectedMessage(null)}
        />
      )}
    </div>
  );
};

export default Messages;