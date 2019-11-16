import { mdsvex } from '../../src/';
import containers from 'remark-containers';
import headings from 'remark-autolink-headings';
import slug from 'remark-slug';
import toc from 'rehype-toc';
import rehype_slug from 'rehype-slug';

export default function(test) {
	test('it should work', async t => {
		const output = await mdsvex().markup({
			content: `# hello`,
			filename: 'file.svexy',
		});

		t.equal(output.code, `<h1>hello</h1>`);
	});

	test('it should accept a remark plugin', async t => {
		const output = await mdsvex({ remarkPlugins: [containers] }).markup({
			content: `
::: div thingy

Hello friends, how are we today

<Counter />

:::
      `,
			filename: 'file.svexy',
		});

		t.equal(
			`<div class="thingy"><p>Hello friends, how are we today</p><Counter /></div>`,
			output.code
		);
	});

	test('it should accept remark plugins - plural', async t => {
		const output = await mdsvex({
			remarkPlugins: [containers, slug, headings],
		}).markup({
			content: `# Lorem ipsum 😪

::: div thingy

Hello friends, how are we today

<Counter />

:::
    `,
			filename: 'file.svexy',
		});

		t.equal(
			`<h1 id="lorem-ipsum-"><a href="#lorem-ipsum-" aria-hidden="true"><span class="icon icon-link"></span></a>Lorem ipsum 😪</h1>
<div class="thingy"><p>Hello friends, how are we today</p><Counter /></div>`,
			output.code
		);
	});

	test('it should accept remark plugins with options - plural', async t => {
		const output = await mdsvex({
			remarkPlugins: [containers, slug, [headings, { behavior: 'append' }]],
		}).markup({
			content: `# Lorem ipsum 😪

::: div thingy

Hello friends, how are we today

<Counter />

:::
    `,
			filename: 'file.svexy',
		});

		t.equal(
			`<h1 id="lorem-ipsum-">Lorem ipsum 😪<a href="#lorem-ipsum-" aria-hidden="true"><span class="icon icon-link"></span></a></h1>
<div class="thingy"><p>Hello friends, how are we today</p><Counter /></div>`,
			output.code
		);
	});

	test('it should accept a rehype plugin', async t => {
		const output = await mdsvex({
			rehypePlugins: [toc],
		}).markup({
			content: `# One

## Two

### Three`,
			filename: 'file.svexy',
		});

		t.equal(
			`<nav class="toc"><ol class="toc-level toc-level-1"><li class="toc-item toc-item-h1"><a class="toc-link toc-link-h1" href="#">One</a><ol
  class="toc-level toc-level-2"
><li class="toc-item toc-item-h2"><a class="toc-link toc-link-h2" href="#">Two</a><ol
  class="toc-level toc-level-3"
><li class="toc-item toc-item-h3"><a class="toc-link toc-link-h3" href="#">Three</a></li></ol></li></ol></li></ol></nav><h1>One</h1>
<h2>Two</h2>
<h3>Three</h3>`,
			output.code
		);
	});

	test('it should accept rehype plugins - plural', async t => {
		const output = await mdsvex({
			rehypePlugins: [rehype_slug, toc],
		}).markup({
			content: `# One

## Two

### Three`,
			filename: 'file.svexy',
		});

		t.equal(
			`<nav class="toc"><ol class="toc-level toc-level-1"><li class="toc-item toc-item-h1"><a class="toc-link toc-link-h1" href="#one">One</a><ol
  class="toc-level toc-level-2"
><li class="toc-item toc-item-h2"><a class="toc-link toc-link-h2" href="#two">Two</a><ol
  class="toc-level toc-level-3"
><li class="toc-item toc-item-h3"><a class="toc-link toc-link-h3" href="#three">Three</a></li></ol></li></ol></li></ol></nav><h1
  id="one"
>One</h1>
<h2 id="two">Two</h2>
<h3 id="three">Three</h3>`,
			output.code
		);
	});

	test('it should accept rehype plugins with options - plural', async t => {
		const output = await mdsvex({
			rehypePlugins: [rehype_slug, [toc, { nav: false }]],
		}).markup({
			content: `# One

## Two

### Three`,
			filename: 'file.svexy',
		});

		t.equal(
			`<ol class="toc toc-level toc-level-1"><li class="toc-item toc-item-h1"><a class="toc-link toc-link-h1" href="#one">One</a><ol
  class="toc-level toc-level-2"
><li class="toc-item toc-item-h2"><a class="toc-link toc-link-h2" href="#two">Two</a><ol
  class="toc-level toc-level-3"
><li class="toc-item toc-item-h3"><a class="toc-link toc-link-h3" href="#three">Three</a></li></ol></li></ol></li></ol><h1
  id="one"
>One</h1>
<h2 id="two">Two</h2>
<h3 id="three">Three</h3>`,
			output.code
		);
	});

	test('it should respect the smartypants option', async t => {
		const output = await mdsvex({
			smartypants: true,
		}).markup({
			content: `"Hello friends!" 'This is some stuff...'`,
			filename: 'file.svexy',
		});

		t.equal(`<p>“Hello friends!” ‘This is some stuff…’</p>`, output.code);
	});

	test('it should accept a smartypants options object', async t => {
		const output = await mdsvex({
			smartypants: { dashes: 'oldschool', ellipses: false },
		}).markup({
			content: `hello---friend...`,
			filename: 'file.svexy',
		});

		t.equal(`<p>hello—friend...</p>`, output.code);
	});

	test('only expected file extension names should work', async t => {
		const output = await mdsvex().markup({
			content: `# hello`,
			filename: 'file.boo',
		});

		t.equal(undefined, output);
	});

	test('the extension name should be customisable', async t => {
		const output = await mdsvex({ extension: '.jesus' }).markup({
			content: `# hello`,
			filename: 'file.jesus',
		});

		t.equal(`<h1>hello</h1>`, output.code);
	});

	test('custom layouts should work', async t => {
		const output = await mdsvex({ layout: 'path/to/layout' }).markup({
			content: `# hello`,
			filename: 'file.svexy',
		});

		t.equal(
			output.code,
			`
<script>
  import Layout_MDSVEX_DEFAULT from 'path/to/layout';
</script>

<Layout_MDSVEX_DEFAULT>
<h1>hello</h1>
</Layout_MDSVEX_DEFAULT>`
		);
	});

	test('custom layouts should work - when there are script tags', async t => {
		const output = await mdsvex({ layout: 'path/to/layout' }).markup({
			content: `
<script>
  export let x = 1;
</script>

# hello

<style>
  h1 {
    color: pink;
  }
</style>
`,
			filename: 'file.svexy',
		});

		t.equal(
			output.code,
			`<script>
  import Layout_MDSVEX_DEFAULT from 'path/to/layout';
  export let x = 1;
</script>
<style>
  h1 {
    color: pink;
  }
</style>
<Layout_MDSVEX_DEFAULT>

<h1>hello</h1>

</Layout_MDSVEX_DEFAULT>`
		);
	});

	test('custom layouts should work - when everything is in a random order', async t => {
		const output = await mdsvex({ layout: 'path/to/layout' }).markup({
			content: `
# hello

<script>
  export let x = 1;
</script>

hello friends

<svelte:window />

<style>
  h1 {
    color: pink;
  }
</style>

boo boo boo
`,
			filename: 'file.svexy',
		});

		t.equal(
			output.code,
			`<script>
  import Layout_MDSVEX_DEFAULT from 'path/to/layout';
  export let x = 1;
</script>
<style>
  h1 {
    color: pink;
  }
</style>
<svelte:window />
<Layout_MDSVEX_DEFAULT>
<h1>hello</h1>
<p>hello friends</p>
<p>boo boo boo</p>
</Layout_MDSVEX_DEFAULT>`
		);
	});
}