import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200">
      <button
        className="w-full py-4 px-6 text-left flex justify-between items-center hover:bg-gray-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-medium text-gray-900">{question}</span>
        <span
          className={`transform transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          ▼
        </span>
      </button>
      <div className={`px-6 py-4 bg-gray-50 ${isOpen ? "block" : "hidden"}`}>
        <p className="text-gray-600">{answer}</p>
      </div>
    </div>
  );
};

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const faqData = [
    {
      question: "サービスの利用料金はいくらですか？",
      answer:
        "基本料金は月額1,000円からとなっております。詳細な料金プランについては料金ページをご確認ください。",
    },
    {
      question: "無料トライアルはありますか？",
      answer: "はい、14日間の無料トライアルをご用意しております。",
    },
    {
      question: "解約方法を教えてください",
      answer:
        "マイページから簡単に解約手続きが可能です。解約は月末締めとなります。",
    },
    {
      question: "支払い方法は何がありますか？",
      answer: "クレジットカード、銀行振込、PayPalに対応しております。",
    },
    {
      question: "パスワードを忘れてしまいました",
      answer:
        "ログイン画面の「パスワードを忘れた方」からパスワードの再設定が可能です。",
    },
    {
      question: "アカウントの登録方法を教えてください",
      answer:
        "トップページの「新規登録」ボタンから、必要事項を入力して登録できます。",
    },
    {
      question: "複数のデバイスで利用できますか？",
      answer: "はい、1つのアカウントで最大3台まで同時利用が可能です。",
    },
    {
      question: "領収書の発行は可能ですか？",
      answer: "マイページから領収書のPDFダウンロードが可能です。",
    },
    {
      question: "対応しているブラウザを教えてください",
      answer: "Chrome、Firefox、Safari、Edge の最新版に対応しています。",
    },
    {
      question: "カスタマーサポートの営業時間は？",
      answer: "平日9:00〜18:00の間で対応しております。",
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const ipResponse = await axios.get("https://api.ipify.org?format=json");
      const clientIp = ipResponse.data.ip;

      const response = await axios.post(
        `${import.meta.env.VITE_NODEJS_API_URL}/api/contact`,
        { ...formData, ipAddress: clientIp }
      );

      if (response.status !== 200) {
        throw new Error("送信に失敗しました");
      }

      setSubmitStatus("success");
      setFormData({ name: "", email: "", message: "" });

      await Swal.fire({
        icon: "success",
        title: "お問い合わせを受け付けました",
        html: `
          <div>
            お問い合わせ番号: ${response.data._id}
          </div>
        `,
        confirmButtonText: "確認",
      });
    } catch (error) {
      console.error("Error:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="max-w-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          よくある質問
        </h2>
        <div className="bg-white rounded-lg shadow-lg mb-12">
          {faqData.map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </div>

        <div className="relative mb-12">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-gray-50 px-4 text-sm text-gray-500">
              お問い合わせフォーム
            </span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
            お問い合わせ
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                お名前
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                placeholder="山田 太郎"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                メールアドレス
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                placeholder="example@email.com"
              />
            </div>

            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-700"
              >
                お問い合わせ内容
              </label>
              <textarea
                name="message"
                id="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                placeholder="お問い合わせ内容をご記入ください"
              />
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                送信する
              </button>
            </div>

            {submitStatus === "success" && (
              <div className="text-green-600 text-center">
                お問い合わせを受け付けました。
              </div>
            )}
            {submitStatus === "error" && (
              <div className="text-red-600 text-center">
                送信に失敗しました。もう一度お試しください。
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
