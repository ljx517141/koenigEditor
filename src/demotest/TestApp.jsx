import React, { useState } from 'react';
import content from './content/content.json';
import { KoenigComposer, KoenigEditor } from '@tryghost/koenig-lexical';
import { fetchEmbed } from './utils/fetchEmbed';
import { fileTypes, useFileUpload } from './utils/useFileUpload';
import { useCollections } from './utils/useCollections';
// import { useLocation, useSearchParams } from 'react-router-dom';
import './style/demo.css';
import './style/index.css';

const defaultCardConfig = {
  fetchEmbed: fetchEmbed,
  fetchAutocompleteLinks: () =>
    Promise.resolve([
      { label: 'Homepage', value: window.location.origin + '/' },
      {
        label: 'Free signup',
        value: window.location.origin + '/#/portal/signup/free',
      },
    ]),
  renderLabels: true,
  fetchLabels: () => Promise.resolve(['Label 1', 'Label 2']),
  siteTitle: 'Koenig Lexical',
  siteDescription: `There's a whole lot to discover in this editor. Let us help you settle in.`,
  siteUrl: window.location.origin,
  membersEnabled: true,
  stripeEnabled: true,
  feature: {
    // collections: true,
    collectionsCard: true,
    contentVisibility: true,
  },
  deprecated: {},
  searchLinks: async (term) => {
    // default to showing latest posts when search is empty
    // no delay to simulate posts being pre-loaded in editor
    if (!term) {
      return [
        {
          label: 'Latest posts',
          key: 'latest-posts',
          items: [
            {
              id: '1',
              groupName: 'Latest posts',
              title: "Remote Work's Impact on Job Markets and Employment",
              url: 'https://source.ghost.io/remote-works-impact-on-job-markets/',
              metaText: '8 May 2024',
              //   MetaIcon: LockIcon,
              metaIconTitle: 'Members only',
            },
            {
              id: '2',
              groupName: 'Latest posts',
              title:
                'Robotics Renaissance: How Automation is Transforming Industries',
              url: 'https://source-newsletter.ghost.io/mental-health-awareness-in-the-workplace/',
              metaText: '2 May 2024',
              //   MetaIcon: DollarIcon,
              metaIconTitle: 'Specific tiers only',
            },
            {
              id: '3',
              groupName: 'Latest posts',
              title: 'Biodiversity Conservation in Fragile Ecosystems',
              url: 'https://source.ghost.io/biodiversity-conservation-in-fragile-ecosystems/',
              metaText: '26 June 2024',
              //   MetaIcon: DollarIcon,
              metaIconTitle: 'Paid-members only',
            },
            {
              id: '4',
              groupName: 'Latest posts',
              title:
                'Unveiling the Crisis of Plastic Pollution: Analyzing Its Profound Impact on the Environment',
              url: 'https://source.ghost.io/plastic-pollution-crisis-deepens/',
              metaText: '16 Aug 2023',
            },
          ],
        },
      ];
    }

    // actual search, simulate a network request delay
    return new Promise((resolve) => {
      setTimeout(() => {
        const posts = [
          {
            id: '1',
            groupName: 'Posts',
            title: 'TK Reminders',
            url: 'https://ghost.org/changelog/tk-reminders/',
          },
          {
            id: '2',
            groupName: 'Posts',
            title: '✨ Emoji autocomplete ✨',
            url: 'https://ghost.org/changelog/emoji-picker/',
          },
        ].filter((item) =>
          item.title.toLowerCase().includes(term.toLowerCase())
        );

        const pages = [
          {
            id: '3',
            groupName: 'Pages',
            title: 'How to update Ghost',
            url: 'https://ghost.org/docs/update/',
          },
        ].filter((item) =>
          item.title.toLowerCase().includes(term.toLowerCase())
        );

        const tags = [
          {
            id: '4',
            groupName: 'Tags',
            title: 'Improved',
            url: 'https://ghost.org/changelog/tag/improved/',
          },
        ].filter((item) =>
          item.title.toLowerCase().includes(term.toLowerCase())
        );

        const groups = [];

        if (posts.length) {
          groups.push({ label: 'Posts', key: 'posts', items: posts });
        }
        if (pages.length) {
          groups.push({ label: 'Pages', key: 'pages', items: pages });
        }
        if (tags.length) {
          groups.push({ label: 'Tags', key: 'tags', items: tags });
        }

        resolve(groups);
      }, 250);
    });
  },
};

function getDefaultContent({ editorType }) {
  return content;
}

function getAllowedNodes({ editorType }) {
  return undefined;
}

function DemoEditor({ registerAPI, cursorDidExitAtTop, darkMode }) {
  return (
    <KoenigEditor
      cursorDidExitAtTop={cursorDidExitAtTop}
      darkMode={darkMode}
      registerAPI={registerAPI}
    ></KoenigEditor>
  );
}

function DemoComposer({ editorType, isMultiplayer, setWordCount, setTKCount }) {
  // const [searchParams, setSearchParams] = useSearchParams();
  const { collections, fetchCollectionPosts } = useCollections();

  const skipFocusEditor = React.useRef(false);

  const darkMode = false;
  // const contentParam = searchParams.get('content');

  const defaultContent = React.useMemo(() => {
    return JSON.stringify(getDefaultContent({ editorType }));
  }, [editorType]);

  const initialContent = React.useMemo(() => {
    if (isMultiplayer) {
      return null;
    }

    return defaultContent;
  }, [isMultiplayer, defaultContent]);

  const [editorAPI, setEditorAPI] = useState(null);
  const titleRef = React.useRef(null);
  const containerRef = React.useRef(null);

  function focusTitle() {
    titleRef.current?.focus();
  }

  function maybeSkipFocusEditor(event) {
    const clickedOnDecorator =
      event?.target.closest('[data-lexical-decorator]') !== null ||
      event?.target.hasAttribute('data-lexical-decorator');
    const clickedOnSlashMenu =
      event?.target.closest('[data-kg-slash-menu]') !== null ||
      event?.target.hasAttribute('data-kg-slash-menu');
    const clickedOnPortal =
      event?.target.closest('[data-kg-portal]') !== null ||
      event?.target.hasAttribute('data-kg-portal');

    if (clickedOnDecorator || clickedOnSlashMenu || clickedOnPortal) {
      skipFocusEditor.current = true;
    }
  }

  function focusEditor(event) {
    const clickedOnDecorator =
      event?.target.closest('[data-lexical-decorator]') !== null ||
      event?.target.hasAttribute('data-lexical-decorator');
    const clickedOnSlashMenu =
      event?.target.closest('[data-kg-slash-menu]') !== null ||
      event?.target.hasAttribute('data-kg-slash-menu');
    const clickedOnPortal =
      event?.target.closest('[data-kg-portal]') !== null ||
      event?.target.hasAttribute('data-kg-portal');

    if (
      !skipFocusEditor.current &&
      editorAPI &&
      !clickedOnDecorator &&
      !clickedOnSlashMenu &&
      !clickedOnPortal
    ) {
      let editor = editorAPI.editorInstance;

      let { bottom } = editor._rootElement.getBoundingClientRect();
      if (event.pageY > bottom && event.clientY > bottom) {
        event.preventDefault();
        let addLastParagraph = false;

        editor.getEditorState().read(() => {
          // 已修改源方法 放弃对lexical的依赖 （会导致存在两个lexical--> editorAPI{初始化完成的} and lexical{初始化未完成的} ）
          if (editorAPI.lastNodeIsDecorator()) {
            addLastParagraph = true;
          }
        });

        if (addLastParagraph) {
          editorAPI.insertParagraphAtBottom();
        }

        editorAPI.focusEditor({ position: 'bottom' });
        containerRef.current.scrollTop = containerRef.current.scrollHeight;
      }
    }

    skipFocusEditor.current = false;
  }

  function saveContent() {
    const serializedState = editorAPI.serialize();
    const encodedContent = encodeURIComponent(serializedState);
    // searchParams.set('content', encodedContent);
    // setSearchParams(searchParams);
  }

  React.useEffect(() => {
    const handleFileDrag = (event) => {
      event.preventDefault();
    };

    const handleFileDrop = (event) => {
      if (event.dataTransfer.files.length > 0) {
        event.preventDefault();
        editorAPI?.insertFiles(Array.from(event.dataTransfer.files));
      }
    };

    window.addEventListener('dragover', handleFileDrag);
    window.addEventListener('drop', handleFileDrop);

    return () => {
      window.removeEventListener('dragover', handleFileDrag);
      window.removeEventListener('drop', handleFileDrop);
    };
  }, [editorAPI]);

  const cardConfig = {
    ...defaultCardConfig,
    collections,
    fetchCollectionPosts,
    feature: {
      ...defaultCardConfig.feature,
      contentVisibility:
        // searchParams.get('labs')?.includes('contentVisibility') ||
        defaultCardConfig.feature.contentVisibility,
    },
    searchLinks:
      // searchParams.get('searchLinks') === 'false'
      // ? undefined
      // :
      defaultCardConfig.searchLinks,
    stripeEnabled:
      // searchParams.get('stripe') === 'false'
      // ? false
      // :
      defaultCardConfig.stripeEnabled,
  };

  return (
    <KoenigComposer
      cardConfig={cardConfig}
      darkMode={darkMode}
      enableMultiplayer={isMultiplayer}
      fileUploader={{
        useFileUpload: useFileUpload({ isMultiplayer }),
        fileTypes,
      }}
      initialEditorState={initialContent}
      isTKEnabled={true}
      nodes={getAllowedNodes({ editorType })}
    >
      <div
        className={`koenig-demo relative h-full grow ${darkMode ? 'dark' : ''}`}
        style={{ '--kg-breakout-adjustment': '440px' }}
      >
        {!isMultiplayer ? null : null}
        <div
          ref={containerRef}
          className="h-full overflow-auto overflow-x-hidden"
          onClick={focusEditor}
          onMouseDown={maybeSkipFocusEditor}
        >
          <div className="mx-auto max-w-[740px] px-6 py-[15vmin] lg:px-0">
            <DemoEditor
              cursorDidExitAtTop={focusTitle}
              darkMode={darkMode}
              editorType={editorType}
              registerAPI={setEditorAPI}
              setWordCount={setWordCount}
            />
          </div>
        </div>
      </div>
    </KoenigComposer>
  );
}

const MemoizedDemoComposer = React.memo(DemoComposer);

function DemoApp({ editorType, isMultiplayer }) {
  // const location = useLocation();

  return (
    <div className={`koenig-lexical top`}>
      <MemoizedDemoComposer
        editorType={editorType}
        isMultiplayer={isMultiplayer}
      />
    </div>
  );
}

export default DemoApp;
