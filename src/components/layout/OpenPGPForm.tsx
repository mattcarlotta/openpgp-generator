import { createStore } from 'solid-js/store';
import { batch } from 'solid-js';
import { generateKey } from 'openpgp/lightweight';
import clsx from '../../utils/clsx';
import Input from './Input'

export type InputChangeEvent = InputEvent & {
    currentTarget: HTMLInputElement | HTMLTextAreaElement;
    target: HTMLInputElement | HTMLTextAreaElement;
};

type Store = {
    name: string;
    email: string;
    passphrase: string;
    privateKey: string;
    publicKey: string;
    isSubmitting: boolean;
};

function OpenPGPKey(props: { title: string, children: string }) {
    return (
        <>
            <h2 class="text-xl font-bold">{props.title}</h2>
            <textarea readonly rows="10" class="w-full text-black bg-white p-1" value={props.children} />
        </>
    )
}

export default function OpenPGPForm() {
    const [store, setStore] = createStore<Store>({
        name: '',
        email: '',
        passphrase: '',
        privateKey: '',
        publicKey: '',
        isSubmitting: false,
    });

    const handleInputChange = (e: InputChangeEvent) => {
        setStore(e.target.name as keyof Store, e.target.value);
    };

    const handleSubmit = async (e: Event) => {
        e.preventDefault();

        if (!store.name || !store.email || !store.passphrase) return;

        batch(() => {
            setStore('isSubmitting', true);
            setStore('privateKey', '');
            setStore('publicKey', '');
        })

        try {
            const { privateKey, publicKey } = await generateKey({
                type: 'rsa',
                rsaBits: 4096,
                userIDs: [{ name: store.name, email: store.email }],
                passphrase: store.passphrase
            });

            batch(() => {
                setStore('privateKey', privateKey);
                setStore('publicKey', publicKey);
                setStore('name', '');
                setStore('email', '');
                setStore('passphrase', '');
                setStore('isSubmitting', false);
            });
        } catch (error: any) {
            alert(error.toString());
            setStore('isSubmitting', false);
        }
    };

    return (
        <div class="w-full max-w-xl flex flex-col rounded bg-primary-800 p-8 text-white my-10">
            <h1 class="text-center text-3xl">Generate OpenPGP Keys</h1>
            <form class="full flex flex-col space-y-2" onSubmit={handleSubmit}>
                <Input
                    min="1"
                    type="text"
                    label="Name"
                    id="name"
                    placeholder="Enter name..."
                    value={store.name}
                    onInputChange={handleInputChange}
                />
                <Input
                    type="email"
                    id="email"
                    label="Email"
                    placeholder="Enter email..."
                    value={store.email}
                    onInputChange={handleInputChange}
                />
                <Input
                    type="password"
                    id="passphrase"
                    min="10"
                    max="30"
                    label="Pass Phrase"
                    placeholder="Enter pass phrase..."
                    value={store.passphrase}
                    onInputChange={handleInputChange}
                />
                <div class='!mt-10'>
                    <button
                        disabled={store.isSubmitting}
                        class={clsx(
                            store.isSubmitting ? 'text-gray-200 bg-gray cursor-none' : 'text-white bg-orange-500',
                            'w-full text-lg rounded primary p-3.5'
                        )}
                        type="submit"
                    >
                        {store.isSubmitting ? "Generating keys..." : "Generate"}
                    </button>
                </div>
            </form>
            {store.privateKey && store.publicKey ?
                <div class="mt-4">
                    <div class="h-px border-t border-dashed border-white my-3.5" />
                    <OpenPGPKey title="Private Key">
                        {store.privateKey}
                    </OpenPGPKey>
                    <OpenPGPKey title="Public Key">
                        {store.publicKey}
                    </OpenPGPKey>
                </div>
                : null}
        </div>
    );
}
