from manim import *

class ZenosParadoxIntro(Scene):
    def construct(self):
        # Create title
        title = Text("Zeno's Paradox: Achilles and the Tortoise", font_size=48)
        title.to_edge(UP)
        
        # Display title
        self.play(Write(title))
        self.wait(2)
        
        # Create track (horizontal line)
        track = Line(LEFT * 5, RIGHT * 5, color=WHITE)
        track.shift(DOWN * 1)
        
        # Create starting positions markers
        start_line = Line(UP * 0.3, DOWN * 0.3, color=WHITE)
        start_line.move_to(LEFT * 4 + DOWN * 1)
        
        tortoise_start = Line(UP * 0.3, DOWN * 0.3, color=GREEN)
        tortoise_start.move_to(LEFT * 1 + DOWN * 1)
        
        # Create Achilles (red runner icon)
        achilles_body = Circle(radius=0.2, color=RED, fill_opacity=1)
        achilles_legs = VGroup(
            Line(ORIGIN, DOWN * 0.3, color=RED),
            Line(ORIGIN, DOWN * 0.3 + RIGHT * 0.1, color=RED)
        )
        achilles_arms = VGroup(
            Line(ORIGIN, RIGHT * 0.2, color=RED),
            Line(ORIGIN, LEFT * 0.2, color=RED)
        )
        achilles = VGroup(achilles_body, achilles_legs, achilles_arms)
        achilles.move_to(LEFT * 4 + DOWN * 1 + UP * 0.5)
        
        # Create Tortoise (green icon)
        tortoise_shell = Ellipse(width=0.6, height=0.4, color=GREEN, fill_opacity=1)
        tortoise_head = Circle(radius=0.1, color=GREEN, fill_opacity=1)
        tortoise_head.move_to(tortoise_shell.get_right() + RIGHT * 0.1)
        tortoise_legs = VGroup(
            *[Circle(radius=0.05, color=GREEN, fill_opacity=1) for _ in range(4)]
        )
        for i, leg in enumerate(tortoise_legs):
            leg.move_to(tortoise_shell.get_bottom() + RIGHT * (i - 1.5) * 0.2 + DOWN * 0.1)
        
        tortoise = VGroup(tortoise_shell, tortoise_head, tortoise_legs)
        tortoise.move_to(LEFT * 1 + DOWN * 1 + UP * 0.5)
        
        # Show track and starting positions
        self.play(Create(track))
        self.play(Create(start_line), Create(tortoise_start))
        self.wait(1)
        
        # Introduce characters
        self.play(FadeIn(achilles))
        achilles_label = Text("Achilles (Fast)", font_size=24, color=RED)
        achilles_label.next_to(achilles, UP)
        self.play(Write(achilles_label))
        self.wait(1)
        
        self.play(FadeIn(tortoise))
        tortoise_label = Text("Tortoise (Slow)", font_size=24, color=GREEN)
        tortoise_label.next_to(tortoise, UP)
        self.play(Write(tortoise_label))
        self.wait(1)
        
        # Show head start distance
        head_start_arrow = DoubleArrow(
            start_line.get_center() + UP * 0.8,
            tortoise_start.get_center() + UP * 0.8,
            color=YELLOW
        )
        head_start_label = Text("100 meters head start", font_size=20, color=YELLOW)
        head_start_label.next_to(head_start_arrow, UP)
        
        self.play(Create(head_start_arrow))
        self.play(Write(head_start_label))
        self.wait(2)
        
        # Clear some elements and pose the central question
        self.play(
            FadeOut(head_start_arrow),
            FadeOut(head_start_label),
            FadeOut(achilles_label),
            FadeOut(tortoise_label)
        )
        
        # Central question
        question = VGroup(
            Text("Achilles is much faster, but", font_size=36),
            Text("Zeno's Paradox suggests he can", font_size=36),
            Text("never actually catch the Tortoise.", font_size=36),
            Text("How?", font_size=42, color=YELLOW)
        )
        question.arrange(DOWN, buff=0.3)
        question.move_to(UP * 1.5)
        
        for line in question:
            self.play(Write(line))
            self.wait(0.5)
        
        self.wait(3)
        
        # Final scene with question mark
        question_mark = Text("?", font_size=80, color=YELLOW)
        question_mark.move_to(RIGHT * 3 + UP * 0.5)
        
        self.play(Write(question_mark))
        self.wait(2)