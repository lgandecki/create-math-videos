from manim import *
import numpy as np

class LogarithmsAsDoublings(Scene):
    def construct(self):
        # Title
        title = Text("Logarytmy jako \"Ile podwojeń?\"", font_size=48)
        subtitle = Text("Zrozumienie, dlaczego suwak logarytmiczny działa", font_size=24)
        subtitle.next_to(title, DOWN)
        
        self.play(Write(title))
        self.play(FadeIn(subtitle))
        self.wait(2)
        self.play(FadeOut(title, subtitle))

        # Recall from lesson 3a
        self.recall_doublings()
        
        # Clear scene
        self.play(*[FadeOut(mob) for mob in self.mobjects])
        self.wait()
        
        # Richter scale example
        self.richter_scale_example()
        
        # Final insight
        self.play(*[FadeOut(mob) for mob in self.mobjects])
        self.logarithmic_slider_connection()

    def recall_doublings(self):
        # Title
        recall_title = Text("Przypomnienie z lekcji 3a", font_size=32).to_edge(UP)
        self.play(Write(recall_title))
        
        # Two axes from lesson 3a
        doublings_axis = NumberLine(
            x_range=[0, 4, 1],
            length=8,
            include_numbers=True,
            font_size=20
        ).shift(UP * 1.5)
        
        energy_axis = NumberLine(
            x_range=[0, 16, 2],
            length=8,
            include_numbers=False,
            font_size=20
        ).shift(DOWN * 1.5)
        
        doublings_label = Text("Liczba Podwojeń", font_size=20).next_to(doublings_axis, UP)
        energy_label = Text("Energia", font_size=20).next_to(energy_axis, DOWN)
        
        self.play(
            Create(doublings_axis),
            Create(energy_axis),
            Write(doublings_label),
            Write(energy_label)
        )
        
        # Add energy values
        energy_values = [1, 2, 4, 8, 16]
        energy_labels = VGroup()
        for i, val in enumerate(energy_values):
            pos = energy_axis.n2p(val)
            label = Text(str(val), font_size=16).next_to(pos, DOWN, buff=0.2)
            energy_labels.add(label)
        
        self.play(Write(energy_labels))
        
        # Draw connections
        connections = VGroup()
        for i in range(5):
            start = doublings_axis.n2p(i) + DOWN * 0.1
            end = energy_axis.n2p(2**i) + UP * 0.1
            line = Line(start, end, stroke_width=1, color=YELLOW, stroke_opacity=0.5)
            connections.add(line)
        
        self.play(Create(connections))
        self.wait()
        
        # Introduce logarithm
        brace = Brace(doublings_axis, UP)
        new_label = MathTex(r"\log_2(\text{Energia})", font_size=24)
        new_label.next_to(brace, UP)
        
        self.play(
            Create(brace),
            Transform(doublings_label, new_label)
        )
        self.wait(2)

    def richter_scale_example(self):
        # Title
        richter_title = Text("Przykład: Skala Richtera", font_size=36).to_edge(UP)
        self.play(Write(richter_title))
        
        # Seismograph visualization
        seismograph = self.create_seismograph()
        seismograph.shift(LEFT * 3)
        
        # Small earthquake
        small_wave = self.create_seismic_wave(amplitude=0.5, frequency=3)
        small_wave.move_to(seismograph.get_center())
        
        amplitude_text1 = Text("Amplituda = 100", font_size=20).next_to(seismograph, DOWN)
        question1 = Text("Ile to w skali Richtera?", font_size=18, color=YELLOW).next_to(amplitude_text1, DOWN)
        
        self.play(
            Create(seismograph),
            Create(small_wave),
            Write(amplitude_text1),
            Write(question1)
        )
        self.wait()
        
        # Explanation
        explanation = VGroup(
            Text("Skala Richtera to", font_size=20),
            MathTex(r"\log_{10}", font_size=32, color=GREEN),
            Text("amplitudy", font_size=20)
        ).arrange(RIGHT).shift(RIGHT * 2)
        
        self.play(Write(explanation))
        self.wait()
        
        # Calculation
        calc1 = MathTex(r"\log_{10}(100) = 2", font_size=24).next_to(explanation, DOWN, buff=0.5)
        richter1 = Text("2.0 w skali Richtera", font_size=20, color=GREEN).next_to(calc1, DOWN)
        
        self.play(Write(calc1))
        self.play(Write(richter1))
        self.wait()
        
        # Larger earthquake
        self.play(
            FadeOut(small_wave, amplitude_text1, question1, calc1, richter1)
        )
        
        large_wave = self.create_seismic_wave(amplitude=2, frequency=2)
        large_wave.move_to(seismograph.get_center())
        
        amplitude_text2 = Text("Amplituda = 1000", font_size=20).next_to(seismograph, DOWN)
        
        self.play(
            Create(large_wave),
            Write(amplitude_text2)
        )
        
        # Calculation for larger earthquake
        calc2 = MathTex(r"\log_{10}(1000) = 3", font_size=24).next_to(explanation, DOWN, buff=0.5)
        richter2 = Text("3.0 w skali Richtera", font_size=20, color=RED).next_to(calc2, DOWN)
        
        self.play(Write(calc2))
        self.play(Write(richter2))
        self.wait()
        
        # Key insight
        key_insight = VGroup(
            Text("Różnica o 1 w skali Richtera", font_size=24),
            Text("to nie +1 do siły,", font_size=24),
            Text("to ×10 do siły!", font_size=28, color=YELLOW)
        ).arrange(DOWN).to_edge(DOWN)
        
        self.play(Write(key_insight))
        self.wait(2)

    def logarithmic_slider_connection(self):
        # Title
        final_title = Text("Suwak logarytmiczny - teraz to ma sens!", font_size=36).to_edge(UP)
        self.play(Write(final_title))
        
        # Linear scale
        linear_scale = NumberLine(
            x_range=[0, 5, 1],
            length=10,
            include_numbers=True,
            font_size=16
        ).shift(UP * 1)
        
        linear_label = Text("Kroki na suwaku (pozycja)", font_size=20).next_to(linear_scale, UP)
        
        # Logarithmic scale  
        log_scale = Line(LEFT * 5, RIGHT * 5).shift(DOWN * 1)
        log_label = Text("Rzeczywista wartość", font_size=20).next_to(log_scale, DOWN)
        
        self.play(
            Create(linear_scale),
            Write(linear_label),
            Create(log_scale),
            Write(log_label)
        )
        
        # Add logarithmic values
        log_values = [1, 10, 100, 1000, 10000, 100000]
        log_positions = VGroup()
        
        for i, val in enumerate(log_values):
            pos = log_scale.get_start() + RIGHT * (i * 2)
            
            # Value label
            if val < 1000:
                label = Text(str(val), font_size=14)
            else:
                label = MathTex(f"10^{{{i}}}", font_size=14)
            label.next_to(pos, DOWN, buff=0.3)
            
            # Dot
            dot = Dot(pos, radius=0.05)
            
            log_positions.add(VGroup(dot, label))
        
        self.play(*[FadeIn(group) for group in log_positions])
        
        # Draw connections
        connections = VGroup()
        for i in range(6):
            start = linear_scale.n2p(i) + DOWN * 0.1
            end = log_scale.get_start() + RIGHT * (i * 2) + UP * 0.1
            line = Line(start, end, stroke_width=2, color=YELLOW, stroke_opacity=0.7)
            connections.add(line)
        
        self.play(Create(connections))
        
        # Show multiplication
        mult_arrows = VGroup()
        for i in range(5):
            start = log_scale.get_start() + RIGHT * (i * 2)
            end = log_scale.get_start() + RIGHT * ((i + 1) * 2)
            arrow = Arrow(start, end, buff=0.1, color=GREEN)
            arrow.shift(UP * 0.3)
            mult_text = Text("×10", font_size=12, color=GREEN)
            mult_text.move_to(arrow.get_center() + UP * 0.3)
            mult_arrows.add(VGroup(arrow, mult_text))
        
        self.play(*[FadeIn(group) for group in mult_arrows])
        
        # Final message
        final_message = VGroup(
            Text("Równe kroki na suwaku", font_size=22),
            Text("↓", font_size=28),
            Text("Mnożenie przez stałą wartość", font_size=22, color=GREEN)
        ).arrange(DOWN).shift(RIGHT * 3)
        
        box = SurroundingRectangle(final_message, buff=0.2, color=YELLOW)
        
        self.play(
            Write(final_message),
            Create(box)
        )
        
        # Connection to audio/visual perception
        perception_note = Text(
            "Tak właśnie odbieramy dźwięk i światło!",
            font_size=20,
            color=BLUE
        ).to_edge(DOWN)
        
        self.play(Write(perception_note))
        self.wait(3)

    def create_seismograph(self):
        # Simple seismograph representation
        frame = Rectangle(width=4, height=2, stroke_width=2)
        paper = Rectangle(width=3.8, height=1.8, fill_color=WHITE, fill_opacity=0.2, stroke_width=0)
        paper.move_to(frame.get_center())
        
        return VGroup(frame, paper)

    def create_seismic_wave(self, amplitude=1, frequency=2):
        # Create a sine wave to represent seismic activity
        wave = ParametricFunction(
            lambda t: np.array([t, amplitude * np.sin(frequency * t * TAU), 0]),
            t_range=[-1.8, 1.8],
            color=RED,
            stroke_width=3
        )
        return wave